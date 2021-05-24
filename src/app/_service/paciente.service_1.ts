import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Paciente } from '../_model/paciente';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private url = `${environment.HOST}/pacientes`;  // ES6  Template Strings ``

  private pacienteCambio: Subject<Paciente[]> = new Subject<Paciente[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  listar() {
    // return this.http.get(environment.HOST + "/pacientes");
    return this.http.get<Paciente[]>(this.url);
  }

  // tslint:disable-next-line: typedef
  listarPorId(id: number) {
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  // tslint:disable-next-line: typedef
  registrar(paciente: Paciente) {
    return this.http.post(this.url, paciente);
  }

  // tslint:disable-next-line: typedef
  modificar(paciente: Paciente) {
    return this.http.put(this.url, paciente);
  }

  // tslint:disable-next-line: typedef
  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
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
