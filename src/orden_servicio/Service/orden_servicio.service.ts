import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { ordenServicioEntity } from "../Entity/OrdenServicio.entity";
import { crearOrdenServicioDto } from "../DTO/crearOrdenServicio.dto";
import { consulltarOrdenServicioPorFiltroDto } from "../DTO/consulltarOrdenServicioPorFiltro.dto";
import { editarOrdenServicioDto } from "../DTO/editarOrdenServicio.dto";

@Injectable()
export class OrdenServicioService {
  constructor(
    @InjectRepository(ordenServicioEntity)
    private readonly ordenServicioRepository: Repository<ordenServicioEntity>
  ) {}

  //Esta funcion se encarga de guardar las OS en la BD
  async insertarOrdenServicioALaBd(
    ListordenServicioDTO: crearOrdenServicioDto[],
    ListaOrdenesServicioEntityExistentes: ordenServicioEntity[]
  ): Promise<string> {
    try {
      // eslint-disable-next-line prefer-const
      let listaOrdenesServiciosRegistrados: ordenServicioEntity[] = [];
      let respuesta: string;

      // Este if verifica si ya hay ordenes de servicio en la BD
      //console.log(ListordenServicioDTO);
      if (ListaOrdenesServicioEntityExistentes.length == 0) {
        for (const ordenServicio of ListordenServicioDTO) {
          const ordenServicioEntity: ordenServicioEntity =
            this.ordenServicioRepository.create(ordenServicio);

          this.ordenServicioRepository.save(ordenServicioEntity);
        }

        respuesta = "Se registraron las OS ";
      } else {
        let contador = 0;
        //console.log(ListordenServicioDTO);
        for (const ordenServicio of ListordenServicioDTO) {
          if (ordenServicio == undefined) {
            console.log("Esta OS ya existe=" + ordenServicio);
          } else {
            contador = contador + 1;
            console.log("Esta OS no existe=" + ordenServicio);
            const ordenServicioEntity: ordenServicioEntity =
              this.ordenServicioRepository.create(ordenServicio);
            this.ordenServicioRepository.save(ordenServicioEntity);
            listaOrdenesServiciosRegistrados.push(ordenServicioEntity);
          }
        }
        console.log(contador);
        if (contador == 0) {
          console.log("Lista OS vieja tiene=" + ListaOrdenesServicioEntityExistentes);
          respuesta = "No se registraron las OS porque ya estan repetidas ";
        } else if (contador > 0) {
          respuesta =
            "Se registraron los siguientes registros: \n" +
            listaOrdenesServiciosRegistrados;
        }
      }
      return respuesta;
    } catch (error) {
      console.log(error);
    }
  }

  //Esta funcion se encarga de obtener una lista de ordenes de servicio de la BD
  findAllOrdenesServicio(): Promise<ordenServicioEntity[]> {
    return this.ordenServicioRepository.find();
  }

  //Esta funcion se encarga de obtener una lista de ordenes de servicio de la BD
  consultarOrdenesServicioPorFiltro(
    filtros: consulltarOrdenServicioPorFiltroDto
  ): Promise<ordenServicioEntity[]> {
    return this.ordenServicioRepository.find({ where: filtros });
  }

  //Esta funcion se encarga de editar una Orden de servicio

  async updateOrdenServicio(
    idOrdenServicio: number,
    editarOrdenServicioDto: editarOrdenServicioDto
  ): Promise<UpdateResult> {
    return this.ordenServicioRepository.update(
      { id_orden_servicio: idOrdenServicio },
      editarOrdenServicioDto
    );
  }

  /*

  async updateLugar(Lugarid: number, lugar: UpdateLugarDto):Promise<UpdateResult>{
        return this.lugarRepository.update({id_lugar:Lugarid},lugar);
    }
    */
}
