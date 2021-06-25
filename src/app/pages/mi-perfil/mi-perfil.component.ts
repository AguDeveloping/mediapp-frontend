import { splitAtColon } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuService } from 'src/app/_service/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  usuario: string;
  roles = "";

  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService;
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;

    const aux_rol = decodedToken.authorities;
    aux_rol.forEach((rol: string, key: number) => {
      if (key == 0) this.roles = rol;
      else this.roles += ", " + rol;
    });
    this.roles += ".";
  }

}
