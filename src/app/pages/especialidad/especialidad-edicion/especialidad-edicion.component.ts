import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Especialidad } from 'src/app/_model/especialidad';
import { EspecialidadService } from 'src/app/_service/especialidad.service';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {

  id: number;
  especialidad: Especialidad;
  form: FormGroup;
  edicion = false;

  constructor(
    private especialidadService: EspecialidadService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.especialidad = new Especialidad();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm(): void {
    if (this.edicion) {
      this.especialidadService.listarPorId(this.id)
        .subscribe(data => {
          const id: number = data.idEspecialidad;
          const nombre: string = data.nombre;
          const descripcion: string = data.descripcion;
          this.form = new FormGroup({
            'id': new FormControl(id),
            'nombre': new FormControl(nombre),
            'descripcion': new FormControl(descripcion)
          });
        });
    }
  }

  operar(): void {
    // tslint:disable-next-line: no-string-literal
    this.especialidad.idEspecialidad = this.form.value['id'];
    // tslint:disable-next-line: no-string-literal
    this.especialidad.nombre = this.form.value['nombre'];
    // tslint:disable-next-line: no-string-literal
    this.especialidad.descripcion = this.form.value['descripcion'];

    if (this.especialidad != null && this.especialidad.idEspecialidad > 0) {
      // buena practica.
      // registro editado.
      this.especialidadService.modificar(this.especialidad)
        .pipe(switchMap(() => {
          return this.especialidadService.listar();
        }))
        .subscribe(data => {
          this.especialidadService.setEspecialidadCambio(data);
          this.especialidadService.setMensajeCambio('Se modificó');
        });
    } else {
      // practica comun.
      // registro nuevo.
      this.especialidadService.registrar(this.especialidad)
        .subscribe(data => {
          this.especialidadService.listar()
            .subscribe(especialidad => {
              this.especialidadService.setEspecialidadCambio(especialidad);
              this.especialidadService.setMensajeCambio('Se registró');
            });
        });
    }

    this.router.navigate(['especialidad']);
  }

}
