import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GlpiApiService {
  constructor(private readonly httpService: HttpService) {}

  //Esta funciion te permite obtener un Token para poder utilizar la API de GLPI
  async obtenerToken(): Promise<string> {
    const headersRequest = {
      "Content-Type": "application/json",
      Authorization: `Basic c2F2ZXNvcG9ydGV0aTpTZXJwYXBybzIy`
    };

    const { data } = await firstValueFrom(
      this.httpService.get("http://10.66.4.108:8888/glpi/apirest.php/initSession", {
        headers: headersRequest
      })
    );

    return data["session_token"];
  }

  //Obtener la lista entera de los tickets del GLPI cumplliendo con ciertos parametros
  async obtenerTicketsGLPI(tokenSession: string): Promise<JSON> {
    const headersRequest = {
      "Content-Type": "application/json",
      "Session-Token": tokenSession
    };

    const paramsRequest = {
      "criteria[0][field]": 8,
      "criteria[0][searchtype]": "contains",
      "criteria[0][value]": "Soporte Técnico",
      "criteria[1][link]": "AND",
      "criteria[1][criteria][0][field]": 12,
      "criteria[1][criteria][0][searchtype]": "equals",
      "criteria[1][criteria][0][value]": 4,
      "criteria[1][criteria][1][link]": "OR",
      "criteria[1][criteria][1][field]": 12,
      "criteria[1][criteria][1][searchtype]": "equals",
      "criteria[1][criteria][1][value]": 2,
      "criteria[2][link]": "AND",
      "criteria[2][field]": 7,
      "criteria[2][searchtype]": "contains",
      "criteria[2][value]": "Servicios de Escritorio"
    };

    const { data } = await firstValueFrom(
      this.httpService.get("http://10.66.4.108:8888/glpi/apirest.php/search/Ticket", {
        params: paramsRequest,
        headers: headersRequest
      })
    );

    return data;
  }

  //Esta funcion obtiene el usuario por su ID y retorna su nombre
  async obtenerNombreUsuarioPorID(tokenSession: string, id: string): Promise<string> {
    let nombreUsuario = "";

    const headersRequest = {
      "Content-Type": "application/json",
      "Session-Token": tokenSession
    };

    const { data } = await firstValueFrom(
      this.httpService.get(`http://10.66.4.108:8888/glpi/apirest.php/User/${id}`, {
        headers: headersRequest
      })
    );

    nombreUsuario = data["realname"] + " " + data["firstname"];
    return nombreUsuario;
  }
}
