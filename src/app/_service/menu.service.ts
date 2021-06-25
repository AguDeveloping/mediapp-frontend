import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../_model/menu';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {

  private menuCambio = new Subject<Menu[]>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/menus`
    );
  }

  // tslint:disable-next-line: typedef
  listarPorUsuario(nombre: string) {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    return this.http.post<Menu[]>(`${this.url}/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  // tslint:disable-next-line: typedef
  getMenuCambio() {
    return this.menuCambio.asObservable();
  }

  setMenuCambio(menus: Menu[]): void {
    this.menuCambio.next(menus);
  }

}
