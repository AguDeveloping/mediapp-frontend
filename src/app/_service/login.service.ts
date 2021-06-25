import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = `${environment.HOST}/oauth/token`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // tslint:disable-next-line: typedef
  login(usuario: string, contrasena: string) {
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  // tslint:disable-next-line: typedef
  estaLogueado() {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  // tslint:disable-next-line: typedef
  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  miPerfil() {
    this.router.navigate(['/pages/mi-perfil']);
  }

}
