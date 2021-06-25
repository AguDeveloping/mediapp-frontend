import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { _MatTabGroupBase } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { SignoVital } from 'src/app/_model/signoVital';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoVitalService } from 'src/app/_service/signo-vital.service';
import { PacienteNuevoComponent } from './paciente-nuevo/paciente-nuevo.component';

@Component({
  selector: 'app-signo-vital-edicion',
  templateUrl: './signo-vital-edicion.component.html',
  styleUrls: ['./signo-vital-edicion.component.css']
})
export class SignoVitalEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  pacientes: Paciente[];
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;
  maxFecha: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svService: SignoVitalService,
    public pacienteService: PacienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

    this.listarPacientes();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.pacientes = data;
    });
    this.pacienteService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000,
        verticalPosition: "bottom",
        horizontalPosition: "center"
      });
    });
  }

  initForm(): void {
    if (this.edicion) {
      this.svService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSignoVital),
          'paciente': new FormControl(data.paciente),
          'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio)
        });
      });
    }
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase())
        || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase())
        || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase())
      || el.apellidos.toLowerCase().includes(val?.toLowerCase())
      || el.dni.includes(val)
    );
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}, DNI: ${val.dni}` : val;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  operar(): void {
    let sv = new SignoVital();
    sv.idSignoVital = this.form.value['id'];
    sv.paciente = this.form.value['paciente'];
    sv.fecha = this.form.value['fecha'];
    sv.temperatura = this.form.value['temperatura'];
    sv.pulso = this.form.value['pulso'];
    sv.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];

    if (this.edicion) {
      // modificar.
      this.svService.modificar(sv).subscribe(() => {
        this.svService.buscarPorIdPaciente(sv.paciente.idPaciente).subscribe(data => {
          this.svService.setSignoVitalCambio(data);
          this.svService.setMensajeCambio('SE MODIFICO');
        });
      });
    } else {
      // registrar.
      this.svService.registrar(sv).subscribe(() => {
        this.svService.buscarPorIdPaciente(sv.paciente.idPaciente).subscribe(data => {
          this.svService.setSignoVitalCambio(data);
          this.svService.setMensajeCambio('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['pages/signo-vital']);
  }

  abrirDialogo() {
    this.dialog.open(PacienteNuevoComponent, {
      width: '400px'
    });
  }
}
