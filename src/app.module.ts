import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { OrdenServicioController } from "./orden_servicio/orden_servicio.controller";
import { OrdenServicioService } from "./orden_servicio/Service/orden_servicio.service";
import { OrdenServicioModule } from "./orden_servicio/orden_servicio.module";
import { LdapModule } from "./ldap/ldap.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mssql",
      host: "10.66.28.134",
      port: 1433,
      username: "soporteTI",
      password: "soporteTI",
      database: "OSsoporteTecnicoInventario",
      autoLoadEntities: true,
      synchronize: false,
      options: {
        encrypt: false
      }
    }),
    OrdenServicioModule,
    LdapModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
