import { Injectable } from "@nestjs/common";
import { usuarioBaseEntity } from "./Entity/usuarioBase.entity";
import * as ldapjs from "ldapjs";
import { inicioSessionDto } from "./DTO/inicioSesionUsuarioLDAP.dto";
import * as CryptoJS from "crypto-js";

@Injectable()
export class LdapService {
  async IniciarSession(datosUsuarios: inicioSessionDto): Promise<usuarioBaseEntity> {
    let jsonObject = "";
    // eslint-disable-next-line prefer-const
    let client = ldapjs.createClient({
      url: "ldap://latccsdc02:389"
    });
    try {
      return new Promise((resolve, rejects) => {
        client.bind("Soporte TI", "Serpapro22", (err) => {
          if (err) {
            console.log("ocurrio algo=" + err);
          } else {
            console.log("Exito");
            client.search(
              "OU=BrinksVZ,OU=z_LATAM,DC=latam,DC=brinksgbl,DC=com",
              {
                filter: `(sAMAccountName=${datosUsuarios.nombreDeCuenta})`,
                scope: "sub",
                attributes: [
                  "name",
                  "department",
                  "description",
                  "employeeType",
                  "mail",
                  "sAMAccountName"
                ]
              },
              function (err, res) {
                let asdf: string;
                if (err) {
                  client.unbind((err) => {
                    if (err) {
                      resolve(null);
                    }
                  });
                  console.log("error");
                  rejects(err);
                } else {
                  res.on("searchRequest", (searchRequest) => {
                    console.log("searchRequest: ", searchRequest.messageID);
                  });
                  res.on("searchEntry", (entry) => {
                    asdf = JSON.stringify(entry.object);
                    jsonObject = JSON.parse(asdf);
                  });
                  res.on("searchReference", (referral) => {
                    console.log("referral: " + referral.uris.join());
                  });
                  res.on("error", (err) => {
                    console.error("error: " + err.message);
                  });
                  res.on("end", (result) => {
                    console.log("status: " + result.status);
                    client.unbind((err) => {
                      if (err) {
                        resolve(null);
                      }
                    });
                    // eslint-disable-next-line prefer-const
                    let client2 = ldapjs.createClient({
                      url: "ldap://latccsdc02:389"
                    });
                    if (jsonObject["dn"] == undefined) {
                      console.log("jaja eroro");
                      resolve(null);
                    } else {
                      console.log(jsonObject);
                      client2.bind(jsonObject["dn"], datosUsuarios.password, (err) => {
                        if (err) {
                          console.log("No se que paso en la coneccion");
                          resolve(null);
                        } else {
                          // eslint-disable-next-line prefer-const
                          let usuario = new usuarioBaseEntity();
                          usuario.nombreDeCuenta = jsonObject["sAMAccountName"];
                          usuario.cargo = jsonObject["description"];
                          usuario.departamento = jsonObject["department:"];
                          usuario.nombreCompleto = jsonObject["name"];
                          usuario.ordenesServicioAsignados = null;
                          usuario.tipoDeTrabajador = jsonObject["employeeType"];
                          usuario.correo = jsonObject["mail"];
                          resolve(usuario);
                        }
                      });
                    }
                  });
                }
              }
            );
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
