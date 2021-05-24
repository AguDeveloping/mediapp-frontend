import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../_dto/consultaListaExamenDTO';

/*interface ConsultaListaExamenDTO{
  consulta: Consulta,
  lstExamen: Examen[];
}*/

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private url = `${environment.HOST}/consultas`;

  constructor(
    private http: HttpClient
  ) { }

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO): any {
    return this.http.post(this.url, consultaDTO);
  }

}
