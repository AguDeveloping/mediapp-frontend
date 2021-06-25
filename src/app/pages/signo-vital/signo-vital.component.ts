import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { SignoVital } from 'src/app/_model/signoVital';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoVitalService } from 'src/app/_service/signo-vital.service';

@Component({
  selector: 'app-signo-vital',
  templateUrl: './signo-vital.component.html',
  styleUrls: ['./signo-vital.component.css']
})
export class SignoVitalComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<SignoVital>;
  displayedColumns: string[] = [
    'idSignoVital',
    'paciente',
    'fecha',
    'temperatura',
    'pulso',
    'ritmoRespiratorio',
    'acciones'
  ];
  cantidad = 0;

  form: FormGroup;
  pacientes: Paciente[];
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;

  idPaciente: number;

  constructor(
    private svService: SignoVitalService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'paciente': this.myControlPaciente
    });

    this.listarPacientes();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.svService.getSignoVitalCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.svService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
    });
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

  // tslint:disable-next-line: typedef
  eliminar(id: number) {
    this.svService.eliminar(id).subscribe(() => {
      this.svService.listar().subscribe(data => {
        this.svService.setSignoVitalCambio(data);
        this.svService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  // tslint:disable-next-line: typedef
  crearTabla(data: SignoVital[]) {
    this.cantidad = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.myControlPaciente.setValue('');
  }

  updateMySelection($event) {
    this.idPaciente = $event.source.value.idPaciente

    this.svService.buscarPorIdPaciente(this.idPaciente).subscribe(data => {
      this.crearTabla(data);
    });
  }

}

