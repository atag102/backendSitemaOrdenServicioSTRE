import { Controller, Get, Body, Post } from "@nestjs/common";
import { LdapService } from "./ldap.service";
import { inicioSessionDto } from "./DTO/inicioSesionUsuarioLDAP.dto";
import { usuarioBaseEntity } from "./Entity/usuarioBase.entity";
import { dn } from "ldapjs";
import { validarLDAPUsernameDto } from "./DTO/datosValidarLDAPUsername";
import { validarLDAPPasswordDto } from "./DTO/datosValidarLDAPPassword";

@Controller("ldap")
export class LdapController {
  constructor(private readonly ldapService: LdapService) {}
  @Post("inicioSession")
  async inicioSession(
    @Body() datosUsuarios: inicioSessionDto
  ): Promise<usuarioBaseEntity> {
    return this.ldapService.IniciarSession2(datosUsuarios);
  }

  @Post("validar/username")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validarUsername(@Body() username: validarLDAPUsernameDto): Promise<any> {
    return this.ldapService.validarUsername(username);
  }

  @Post("validar/password")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validarPassword(@Body() userLDAP: validarLDAPPasswordDto): Promise<any> {
    return this.ldapService.validarPassword(userLDAP);
  }
}
