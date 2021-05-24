import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../_model/medico';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends GenericService<Medico> {

  private medicoCambio: Subject<Medico[]> = new Subject<Medico[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/medicos`
    );
  }

  /********************************************/
  // tslint:disable-next-line: typedef
  getMedicoCambio() {
    return this.medicoCambio.asObservable();
  }
  // tslint:disable-next-line: typedef
  setMedicoCambio(lista: Medico[]) {
    this.medicoCambio.next(lista);
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
