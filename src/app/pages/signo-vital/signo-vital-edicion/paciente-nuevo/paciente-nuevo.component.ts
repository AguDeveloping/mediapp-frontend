import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-nuevo',
  templateUrl: './paciente-nuevo.component.html',
  styleUrls: ['./paciente-nuevo.component.css']
})
export class PacienteNuevoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private pacienteService: PacienteService,
    private dialogRef: MatDialogRef<PacienteNuevoComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),
      'email': new FormControl('')
    });
  }

  operar() {
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];
    paciente.email = this.form.value['email'];

    //REGISTRAR
    this.pacienteService.registrar(paciente).subscribe(() => {
      this.pacienteService.listar().subscribe(data => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajeCambio('SE REGISTRO');
      });
    });
    this.cerrar();
  }

  funcionCerrar() {
    this.cerrar();
  }

  cerrar() {
    this.router.navigate(['pages/signo-vital/nuevo']);
    this.dialogRef.close();
  }
}
