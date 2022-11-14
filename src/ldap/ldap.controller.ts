import { Controller, Get, Body, Post } from "@nestjs/common";
import { LdapService } from "./ldap.service";
import { inicioSessionDto } from "./DTO/inicioSesionUsuarioLDAP.dto";
import { usuarioBaseEntity } from "./Entity/usuarioBase.entity";

@Controller("ldap")
export class LdapController {
  constructor(private readonly ldapService: LdapService) {}
  @Post("inicioSession")
  async inicioSession(
    @Body() datosUsuarios: inicioSessionDto
  ): Promise<usuarioBaseEntity> {
    return this.ldapService.IniciarSession(datosUsuarios);
  }
}
