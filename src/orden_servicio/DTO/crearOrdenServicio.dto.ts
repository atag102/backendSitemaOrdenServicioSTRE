export class crearOrdenServicioDto {
  id_orden_servicio: number;
  nombre_solicitante: string;
  nombre_grupo_origen: string;
  titulo_requrimiento: string;
  descripcion_requerimiento: string;
  nombre_grupo_asignado: string;
  tipo_requerimiento: string;
  categoria_requerimiento: string;
  fecha_inicio: Date;
  fecha_culminacion: Date;
  estado: string;
  nombre_analista: string;
  detalle_servicio: string;
  nombre_coordinador_servicio: string;
  nombre_gte_infraestructura_TI: string;
  observaciones: string;
}
