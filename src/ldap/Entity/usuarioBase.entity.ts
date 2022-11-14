import { ordenServicioEntity } from "src/orden_servicio/Entity/OrdenServicio.entity";

export class usuarioBaseEntity {
  nombreCompleto: string;
  departamento: string;
  cargo: string;
  tipoDeTrabajador: string;
  correo: string;
  nombreDeCuenta: string;
  ordenesServicioAsignados: ordenServicioEntity[];
}
