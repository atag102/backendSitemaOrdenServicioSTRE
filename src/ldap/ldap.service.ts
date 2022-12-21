import { Injectable } from "@nestjs/common";
import { usuarioBaseEntity } from "./Entity/usuarioBase.entity";
import * as ldapjs from "ldapjs";
import { inicioSessionDto } from "./DTO/inicioSesionUsuarioLDAP.dto";
import * as CryptoJS from "crypto-js";
import { assert } from "console";
import { AssertionError } from "assert";
import { Logger } from "@nestjs/common/services";
import { validarLDAPUsernameDto } from "./DTO/datosValidarLDAPUsername";
import { validarLDAPPasswordDto } from "./DTO/datosValidarLDAPPassword";

@Injectable()
export class LdapService {
  /* async IniciarSession(datosUsuarios: inicioSessionDto): Promise<usuarioBaseEntity> {
    let jsonObject = "";
    // eslint-disable-next-line prefer-const
    let client = ldapjs.createClient({
      url: "ldap://latccsdc02:389",
      reconnect: true,
      tlsOptions: {
        rejectUnauthorized: true
      }
    });
    return new Promise((resolve, rejects) => {
      client.bind("Soporte TI", "Serpapro22", (err) => {
        if (err) {
          console.log("ocurrio algo=" + err);
          client.unbind((err) => {
            if (err) {
              resolve(null);
            }
          });
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
                    resolve({
                      nombreCompleto: null,
                      departamento: null,
                      cargo: null,
                      tipoDeTrabajador: null,
                      correo: null,
                      nombreDeCuenta: null,
                      ordenesServicioAsignados: null
                    });
                  } else {
                    console.log("Cliente 1 desconectado primera ves");
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
                  console.error("error456: " + err.message);
                });
                res.on("end", (result) => {
                  console.log("status: " + result.status);
                  client.unbind((err) => {
                    if (err) {
                      console.log(err);
                      resolve({
                        nombreCompleto: null,
                        departamento: null,
                        cargo: null,
                        tipoDeTrabajador: null,
                        correo: null,
                        nombreDeCuenta: null,
                        ordenesServicioAsignados: null
                      });
                    } else {
                      console.log("Cliente 1 desconectado segunda ves");
                    }
                  });
                  // eslint-disable-next-line prefer-const
                  let client2 = ldapjs.createClient({
                    url: "ldap://latccsdc02:389"
                  });
                  if (jsonObject["dn"] == undefined) {
                    console.log(jsonObject);
                    console.log(jsonObject["dn"]);
                    console.log("jaja eroro");
                    client2.unbind((err) => {
                      if (err) {
                        resolve({
                          nombreCompleto: null,
                          departamento: null,
                          cargo: null,
                          tipoDeTrabajador: null,
                          correo: null,
                          nombreDeCuenta: null,
                          ordenesServicioAsignados: null
                        });
                      } else {
                        console.log("Cliente 2 desconectado primera ves");
                      }
                      resolve({
                        nombreCompleto: null,
                        departamento: null,
                        cargo: null,
                        tipoDeTrabajador: null,
                        correo: null,
                        nombreDeCuenta: null,
                        ordenesServicioAsignados: null
                      });
                    });
                  } else {
                    console.log(jsonObject);
                    console.log(jsonObject["dn"]);
                    client2.bind(jsonObject["dn"], datosUsuarios.password, (err) => {
                      if (err) {
                        console.log("No se que paso en la coneccion");
                        client2.unbind((err) => {
                          if (err) {
                            resolve({
                              nombreCompleto: null,
                              departamento: null,
                              cargo: null,
                              tipoDeTrabajador: null,
                              correo: null,
                              nombreDeCuenta: null,
                              ordenesServicioAsignados: null
                            });
                          } else {
                            console.log("Cliente 2 desconectado primera ves");
                          }
                        });
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
                        client2.unbind((err) => {
                          if (err) {
                            console.log(err);
                            resolve({
                              nombreCompleto: null,
                              departamento: null,
                              cargo: null,
                              tipoDeTrabajador: null,
                              correo: null,
                              nombreDeCuenta: null,
                              ordenesServicioAsignados: null
                            });
                          } else {
                            console.log("Cliente 2 desconectado segunda ves");
                          }
                        });
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
  } */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async IniciarSession2(datosUsuarios: inicioSessionDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jsonObject = "";
    // eslint-disable-next-line prefer-const
    let usuario = new usuarioBaseEntity();
    let asdf = "";
    // eslint-disable-next-line prefer-const
    let client = ldapjs.createClient({
      url: "ldap://latccsdc02:389",
      reconnect: true,
      idleTimeout: 3000
    });
    // eslint-disable-next-line prefer-const
    let client2 = ldapjs.createClient({
      url: "ldap://latccsdc02:389",
      reconnect: true,
      idleTimeout: 3000
    });
    return new Promise((resolve, rejects) => {
      client.bind("Soporte TI", "Serpapro22", function (err) {
        if (err) {
          resolve("Wrong password");
        }
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
          function (err, resultado) {
            console.log(resultado);
            resultado.on("searchEntry", function (entry) {
              client.unbind(function (erra) {
                if (erra) {
                  console.log(erra);
                } else {
                  console.log("se Desconecto 1");
                }
              });
              client.destroy();
              asdf = JSON.stringify(entry.object);
              jsonObject = JSON.parse(asdf);
              console.log("JO=" + jsonObject["dn"]);
              console.log("Nombre usuario correcto");

              client2.bind(jsonObject["dn"], datosUsuarios.password, function (err) {
                if (err) {
                  resolve("Password Incorrecta");
                } else {
                  console.log(jsonObject);
                  usuario.nombreDeCuenta = jsonObject["sAMAccountName"];
                  usuario.cargo = jsonObject["description"];
                  usuario.departamento = jsonObject["department:"];
                  usuario.nombreCompleto = jsonObject["name"];
                  usuario.ordenesServicioAsignados = null;
                  usuario.tipoDeTrabajador = jsonObject["employeeType"];
                  usuario.correo = jsonObject["mail"];
                  client2.unbind(function (erra) {
                    if (erra) {
                      console.log(erra);
                    } else {
                      console.log("se Desconecto 2");
                    }
                  });
                  client2.destroy();
                  resolve(usuario);
                }
              });
            });
            resultado.on("searchRequest", (searchRequest) => {
              console.log("searchRequest: ", searchRequest.messageID);
            });
            resultado.on("searchReference", (referral) => {
              console.log("referral: " + referral.uris.join());
            });
            resultado.on("error", (err) => {
              console.error("error456: " + err.message);
            });
            resultado.on("end", function (result) {
              if (!jsonObject) {
                resolve("username incorrecto");
                client.unbind();
                client.destroy();
              }
            });
          }
        );
        console.log("JO=" + jsonObject);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validarUsername(datosUsuarios: validarLDAPUsernameDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jsonObject = "";
    let asdf = "";
    // eslint-disable-next-line prefer-const
    let client = ldapjs.createClient({
      url: "ldap://latccsdc02:389",
      reconnect: true,
      idleTimeout: 3000
    });
    return new Promise((resolve, rejects) => {
      client.bind("Soporte TI", "Serpapro22", function (err) {
        if (err) {
          resolve("Wrong password");
        }
        client.search(
          "OU=BrinksVZ,OU=z_LATAM,DC=latam,DC=brinksgbl,DC=com",
          {
            filter: `(sAMAccountName=${datosUsuarios.username})`,
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
          function (err, resultado) {
            console.log(resultado);
            resultado.on("searchEntry", function (entry) {
              client.unbind(function (erra) {
                if (erra) {
                  console.log(erra);
                } else {
                  console.log("se Desconecto 1");
                }
              });
              client.destroy();
              asdf = JSON.stringify(entry.object);
              jsonObject = JSON.parse(asdf);
              console.log("JO=" + jsonObject["dn"]);
              console.log("Nombre usuario correcto");
              resolve(jsonObject);
            });
            resultado.on("searchRequest", (searchRequest) => {
              console.log("searchRequest: ", searchRequest.messageID);
            });
            resultado.on("searchReference", (referral) => {
              console.log("referral: " + referral.uris.join());
            });
            resultado.on("error", (err) => {
              Logger.error(err.message);
              client.unbind();
              client.destroy();
            });
            resultado.on("end", function (result) {
              if (!jsonObject) {
                resolve("username incorrecto");
                client.unbind();
                client.destroy();
              }
            });
          }
        );
        console.log("JO=" + jsonObject);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validarPassword(userLDAP: validarLDAPPasswordDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // eslint-disable-next-line prefer-const
    let client = ldapjs.createClient({
      url: "ldap://latccsdc02:389",
      reconnect: true,
      idleTimeout: 3000
    });
    return new Promise((resolve, rejects) => {
      client.bind(userLDAP.dn, userLDAP.password, function (err) {
        client.unbind();
        client.destroy();
        if (err) {
          resolve("Password incorrecta");
        } else {
          resolve("Password correcta");
        }
        console.log("JO=" + userLDAP.dn);
      });
    });
  }
}
