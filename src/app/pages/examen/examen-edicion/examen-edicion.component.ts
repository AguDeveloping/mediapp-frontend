import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Examen } from 'src/app/_model/examen';
import { ExamenService } from 'src/app/_service/examen.service';

@Component({
  selector: 'app-examen-edicion',
  templateUrl: './examen-edicion.component.html',
  styleUrls: ['./examen-edicion.component.css']
})
// tslint:disable: no-string-literal
export class ExamenEdicionComponent implements OnInit {

  id: number;
  examen: Examen;
  form: FormGroup;
  edicion = false;

  constructor(
    private examenService: ExamenService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {

    this.examen = new Examen();

    this.form = new FormGroup({
      id: new FormControl(0),
      nombre: new FormControl(''),
      descripcion: new FormControl(''),
    });


    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm(): void {
    if (this.edicion) {
      this.examenService.listarPorId(this.id).subscribe(data => {
        const id = data.idExamen;
        const nombre = data.nombre;
        const descripcion = data.descripcion;

        this.form = new FormGroup({
          id: new FormControl(id),
          nombre: new FormControl(nombre),
          descripcion: new FormControl(descripcion)
        });
      });
    }
  }

  operar(): void {
    // tslint:disable: no-string-literal
    this.examen.idExamen = this.form.value['id'];
    this.examen.nombre = this.form.value['nombre'];
    this.examen.descripcion = this.form.value['descripcion'];

    if (this.examen != null && this.examen.idExamen > 0) {
      // BUENA PRACTICA
      this.examenService.modificar(this.examen).pipe(switchMap(() => {
        return this.examenService.listar();
      })).subscribe(data => {
        this.examenService.setExamenCambio(data);
        this.examenService.setMensajeCambio('Se modificó');
      });
    } else {
      // PRACTICA COMUN
      this.examenService.registrar(this.examen).subscribe(data => {
        this.examenService.listar().subscribe(especialidad => {
          this.examenService.setExamenCambio(especialidad);
          this.examenService.setMensajeCambio('Se registró');
        });
      });
    }

    this.router.navigate(['examen']);
  }

}
