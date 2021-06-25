import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../_dto/consultaListaExamenDTO';
import { ConsultaResumenDTO } from '../_dto/consultaResumenDTO';
import { FiltroConsultaDTO } from '../_dto/filtroConsultaDTO';
import { Consulta } from '../_model/consulta';

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

  buscarOtros(filtroConsulta: FiltroConsultaDTO): any {
    return this.http.post<Consulta[]>(`${this.url}/buscar/otros`, filtroConsulta);
  }

  buscarFecha(fecha: string): any {
    return this.http.get<Consulta[]>(`${this.url}/buscar?fecha=${fecha}`);
  }

  listarExamenPorConsulta(idConsulta: number): any {
    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST}/consultaexamenes/${idConsulta}`);
  }

  listarResumen(): any {
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  generarReporte(): any {
    return this.http.get(`${this.url}/generarReporte`, { responseType: 'blob' });
  }

  guardarArchivo(data: File): any {  // medico: Medico
    const formdata: FormData = new FormData();
    formdata.append('adjunto', data);
    // const medicoBlob = new Blob([JSON.stringify(medico)], { type: "application/json" });
    // formdata.append('medico', medicoBlob)
    return this.http.post(`${this.url}/guardarArchivo`, formdata);
  }

  leerArchivo(): any {
    return this.http.get(`${this.url}/leerArchivo/1`, { responseType: 'blob' });
  }
}
