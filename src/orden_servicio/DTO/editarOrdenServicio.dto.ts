import { IsOptional, IsString, IsDateString } from "class-validator";
import { estadoOrdenServicio } from "../Enum/enumEstadoOrdenServicio";
export class editarOrdenServicioDto {
  @IsOptional()
  @IsString()
  titulo_requrimiento?: string;

  @IsOptional()
  @IsString()
  descripcion_requerimiento?: string;

  @IsOptional()
  @IsString()
  tipo_requerimiento?: string;

  @IsOptional()
  @IsString()
  categoria_requerimiento?: string;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;

  @IsOptional()
  @IsDateString()
  fecha_culminacion?: Date;

  @IsOptional()
  @IsString({
    groups: [
      estadoOrdenServicio.Abierto.toString(),
      estadoOrdenServicio.Asignado.toString(),
      estadoOrdenServicio.Calidad.toString(),
      estadoOrdenServicio.Cerrado.toString()
    ]
  })
  estado?: string;

  @IsOptional()
  @IsString()
  nombre_analista?: string;

  @IsOptional()
  @IsString()
  detalle_servicio?: string;

  @IsOptional()
  @IsString()
  nombre_coordinador_servicio?: string;

  @IsOptional()
  @IsString()
  nombre_gte_infraestructura_TI?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
