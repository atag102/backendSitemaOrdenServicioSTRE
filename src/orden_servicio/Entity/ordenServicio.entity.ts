import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity("orden_servicio")
export class ordenServicioEntity {
  @PrimaryColumn({ type: "int" })
  id_orden_servicio: number;

  @Column({ type: "varchar", length: 50 })
  nombre_solicitante: string;

  @Column({ type: "varchar", length: 50 })
  nombre_grupo_origen: string;

  @Column({ type: "varchar", length: 5000 })
  titulo_requrimiento: string;

  @Column({ type: "varchar", length: 8000 })
  descripcion_requerimiento: string;

  @Column({ type: "varchar", length: 50 })
  nombre_grupo_asignado: string;

  @Column({ type: "varchar", length: 50 })
  tipo_requerimiento: string;

  @Column({ type: "varchar", length: 5000 })
  categoria_requerimiento: string;

  @Column({ type: "datetime2" })
  fecha_inicio: Date;

  @Column({ type: "datetime2", nullable: true })
  fecha_culminacion: Date;

  @Column({ type: "varchar", length: 50 })
  estado: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  nombre_analista: string;

  @Column({ type: "varchar", length: 5000 })
  detalle_servicio: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  nombre_coordinador_servicio: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  nombre_gte_infraestructura_TI: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  observaciones: string;
}
