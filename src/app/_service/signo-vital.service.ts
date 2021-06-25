import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignoVital } from '../_model/signoVital';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignoVitalService extends GenericService<SignoVital> {

  private signoVitalCambio: Subject<SignoVital[]> = new Subject<SignoVital[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos-vitales`
    );
  }

  listarPageable(p: number, s: number): any {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  buscarPorIdPaciente(idPaciente: number): any {
    return this.http.get<SignoVital[]>(`${this.url}/buscar-por-id-paciente/${idPaciente}`);
  }

  /********************************************/
  // tslint:disable-next-line: typedef
  getSignoVitalCambio() {
    return this.signoVitalCambio.asObservable();
  }
  // tslint:disable-next-line: typedef
  setSignoVitalCambio(lista: SignoVital[]) {
    this.signoVitalCambio.next(lista);
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
