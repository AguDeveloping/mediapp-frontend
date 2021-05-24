import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Examen } from '../_model/examen';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends GenericService<Examen> {

  private examenCambio = new Subject<Examen[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/examenes`
    );
  }

  // get and set.
  getExamenCambio(): Observable<Examen[]> {
    return this.examenCambio.asObservable();
  }

  setExamenCambio(examenes: Examen[]): void {
    this.examenCambio.next(examenes);
  }

  getMensajeCambio(): Observable<string> {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string): void {
    this.mensajeCambio.next(mensaje);
  }

}
