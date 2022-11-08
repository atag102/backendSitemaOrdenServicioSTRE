import { crearOrdenServicioDto } from "../DTO/crearOrdenServicio.dto";
export class castPromiseListTicketTocrearListaOrdenServicioDto {
  public castPromiseToListCrearOrdenServicioDto(
    promesaParaTransformar: Promise<JSON>
  ): crearOrdenServicioDto[] {
    promesaParaTransformar.then((value) => {
      console.log(value);
    });
    return null;
  }
}
