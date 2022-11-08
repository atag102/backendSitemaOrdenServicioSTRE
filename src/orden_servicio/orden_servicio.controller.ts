import { Controller, Get } from "@nestjs/common";
import { OrdenServicioService } from "./Service/orden_servicio.service";
import { crearOrdenServicioDto } from "./DTO/crearOrdenServicio.dto";
import { estadoOrdenServicio } from "./Enum/enumEstadoOrdenServicio";
import { tipoOrdenServicio } from "./Enum/enumTipoOrdenServicio";
import { ordenServicioEntity } from "./Entity/OrdenServicio.entity";
import { consulltarOrdenServicioPorFiltroDto } from "./DTO/consulltarOrdenServicioPorFiltro.dto";
import { GlpiApiService } from "./Service/glpi_api.service";

@Controller("ordenServicio")
export class OrdenServicioController {
  constructor(
    private readonly ordenServicioService: OrdenServicioService,
    private readonly glpiApiService: GlpiApiService
  ) {}

  /*Obtiene el token para iniciar sesion, obtener listas de tickets del GLPI
  para luego crear las ordenes de servicio en la BD*/

  @Get("crearOrdenesServicio")
  async crearOrdenesServicioSinAwaitFor(): Promise<string> {
    //Guardar el token de inicio de sesion para consumir el API REST
    const token = await this.glpiApiService.obtenerToken();

    //Obtener una lista de los tickets generados en el GLPI
    const listaTcketsGLPI = this.glpiApiService.obtenerTicketsGLPI(token);

    //Crear una lista del DTO crearOrdenServicioDto a partir de los tickets del GLPI
    const listaOrdenServicioDto = await Promise.all(
      await this.castPromiseToPromiseListCrearOrdenServicioDto(listaTcketsGLPI, token)
    );

    //Obtener una lista de Ordenes de servicio de la base de datos
    const listaOrdenesServicioViejas =
      await this.ordenServicioService.findAllOrdenesServicio();

    //Guardar la lista de ordenes de servicio en la BD. Como resultado se recibe un string.

    const resultadoMensaje = await this.ordenServicioService.insertarOrdenServicioALaBd(
      listaOrdenServicioDto,
      listaOrdenesServicioViejas
    );

    return "Token=" + token + " " + resultadoMensaje;
  }

  //Casters

  async castPromiseToPromiseListCrearOrdenServicioDto(
    promesaParaTransformar: Promise<JSON>,
    tokenInitSession: string
  ): Promise<Promise<crearOrdenServicioDto>[]> {
    //Lista de DTOs de las ordenes de servicio que se generan a partir de los tickets del GLPI
    const listaOrdenServicioDTO: Promise<crearOrdenServicioDto>[] = [];

    /*Lista de tickets del GLPI apartir de una de una Promesa<JSON>. Es del tipo JSON, la promesa que se espera 
    es un JSON que tiene la estructura de un array que trae varios objetos JSON.Es decir:
    {[{"var1":"valu1"... }]}*/
    const listaTicketsGLPI = await promesaParaTransformar;

    //Guardara el ticket que se buscara por id y se utilizara para ver si hay una Orden de Servicio con ese ID
    let ticketRepetido: Promise<ordenServicioEntity[]>;

    //Este es un dto que se encargara de recibir filtros de busqueda variados para una Orden de Servicio, en este caso solo se pasa el ID
    let filtroOrdenServicioPorId: consulltarOrdenServicioPorFiltroDto;

    //Este es un dto que se encargara de crear el esqueleto de la Orden de Servicio a partir del ticket
    let crearOrdenServicioDto: Promise<crearOrdenServicioDto>;

    //La const itemTicket representa o guardara un ticket del JSON "listaTicketsGLPI". Es decir que guarda un objeto JSON
    for (const itemTicket of listaTicketsGLPI["data"]) {
      filtroOrdenServicioPorId.id_orden_servicio = itemTicket["2"];
      ticketRepetido = this.ordenServicioService.consultarOrdenesServicioPorFiltro(
        filtroOrdenServicioPorId
      );

      crearOrdenServicioDto = this.validarTicketRepetido(
        ticketRepetido,
        tokenInitSession,
        itemTicket
      );

      //Esta validacion verifica si el esqueleto del dto se creo exitosamente entonces recibe un objeto Dto que no es undifined,
      //si al verificar es undifined no lo agrega a la lista
      if (crearOrdenServicioDto["data"] != undefined) {
        listaOrdenServicioDTO.push(crearOrdenServicioDto);
      }
    }
    return listaOrdenServicioDTO;
  }

  //Funciones especiales

  //Esta funcion se encarga de crearte un objeto crearOrdenServicioDto
  public crearDtoCrearOrdenServicioDto(
    nombre: string,
    iterator: JSON,
    nombre_analista: string
  ): crearOrdenServicioDto {
    // eslint-disable-next-line prefer-const
    let ordenServicioDto = new crearOrdenServicioDto();

    ordenServicioDto.id_orden_servicio = iterator["2"];

    ordenServicioDto.nombre_solicitante = nombre;

    ordenServicioDto.nombre_grupo_origen =
      iterator["71"] == null ? "No tiene grupo" : iterator["71"];

    ordenServicioDto.titulo_requrimiento = iterator["1"];

    ordenServicioDto.descripcion_requerimiento = iterator["21"];

    ordenServicioDto.nombre_grupo_asignado = iterator["8"];

    ordenServicioDto.tipo_requerimiento =
      iterator["14"] == String(tipoOrdenServicio.Incidente)
        ? tipoOrdenServicio[tipoOrdenServicio.Incidente]
        : tipoOrdenServicio[tipoOrdenServicio.Solicitud];

    ordenServicioDto.categoria_requerimiento = iterator["7"];

    ordenServicioDto.fecha_inicio = iterator["15"];

    ordenServicioDto.fecha_culminacion = null;

    //Tambien estan los estados Calidad y Culminado
    ordenServicioDto.estado =
      iterator["12"] == String(estadoOrdenServicio.Abierto + 1)
        ? estadoOrdenServicio[estadoOrdenServicio.Abierto]
        : estadoOrdenServicio[estadoOrdenServicio.Asignado];

    ordenServicioDto.nombre_analista = nombre_analista;

    ordenServicioDto.detalle_servicio = null;

    ordenServicioDto.nombre_coordinador_servicio = null;

    ordenServicioDto.nombre_gte_infraestructura_TI = null;

    ordenServicioDto.observaciones = null;

    return ordenServicioDto;
  }

  /*Esta funcion se encarga de verificar si este ticket ya tiene una Orden de Servicio, en caso de ser asi,
  se retorna un undifined de lo contrario se crea el esquleto de la Orden de Servicio dto y lo retorna.
  */
  async validarTicketRepetido(
    ticketRepetido: Promise<ordenServicioEntity[]>,
    tokenInitSession: string,
    itemTicket: JSON
  ): Promise<crearOrdenServicioDto> {
    const osRepetida = await ticketRepetido;

    if (osRepetida.length == 0) {
      // Esta constante guardara el nombre de un cliente despues de realizar su busqueda a partir de su ID.
      let nombreOlicitante = "";
      nombreOlicitante = await this.glpiApiService.obtenerNombreUsuarioPorID(
        tokenInitSession,
        itemTicket["4"]
      );

      let nombre_analista = "";
      nombre_analista =
        itemTicket["12"] == String(estadoOrdenServicio.Asignado)
          ? await this.glpiApiService.obtenerNombreUsuarioPorID(
              tokenInitSession,
              itemTicket["5"]
            )
          : null;

      return this.crearDtoCrearOrdenServicioDto(
        nombreOlicitante,
        itemTicket,
        nombre_analista
      );
    }
    return undefined;
  }
}
