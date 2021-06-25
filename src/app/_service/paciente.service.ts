import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Paciente } from '../_model/paciente';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente> {

  private pacienteCambio: Subject<Paciente[]> = new Subject<Paciente[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/pacientes`
    );
  }

  listarPageable(p: number, s: number): any {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  /********************************************/
  // tslint:disable-next-line: typedef
  getPacienteCambio() {
    return this.pacienteCambio.asObservable();
  }
  // tslint:disable-next-line: typedef
  setPacienteCambio(lista: Paciente[]) {
    this.pacienteCambio.next(lista);
  }

  // tslint:disable-next-line: typedef
  getMensajeCambio() {
    return this.mensajeCambio;
  }
  // tslint:disable-next-line: typedef
  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
