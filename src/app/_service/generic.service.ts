import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http: HttpClient,
    protected url: string
  ) { }

  // tslint:disable-next-line: typedef
  listar() {
    return this.http.get<T[]>(this.url);
  }

  // tslint:disable-next-line: typedef
  listarPorId(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  // tslint:disable-next-line: typedef
  registrar(t: T) {
    return this.http.post(this.url, t);
  }

  // tslint:disable-next-line: typedef
  modificar(t: T) {
    return this.http.put(this.url, t);
  }

  // tslint:disable-next-line: typedef
  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
