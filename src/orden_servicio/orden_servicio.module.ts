import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ordenServicioEntity } from "./Entity/OrdenServicio.entity";
import { OrdenServicioController } from "./orden_servicio.controller";
import { GlpiApiService } from "./Service/glpi_api.service";
import { OrdenServicioService } from "./Service/orden_servicio.service";

@Module({
  imports: [TypeOrmModule.forFeature([ordenServicioEntity]), HttpModule],
  providers: [OrdenServicioService, GlpiApiService],
  controllers: [OrdenServicioController]
})
export class OrdenServicioModule {}
