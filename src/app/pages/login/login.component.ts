import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';
import { environment } from 'src/environments/environment';
import '../../../assets/login-animation.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).subscribe((data: { access_token: string; }) => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/pages/inicio']);
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    (window as any).initialize();
  }
}
