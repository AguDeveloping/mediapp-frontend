import { Component, OnInit, ViewChild } from '@angular/core';

import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})

export class PacienteComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = [
    'idPaciente',
    'nombres',
    'apellidos',
    'acciones'
  ];
  cantidad = 0;

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Este subscribe_1 carga la tabla al iniciarse el componente paciente.
    // this.pacienteService.listar().subscribe(data => {
    //   this.crearTabla(data);
    // });

    this.pacienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

    // Este subscribe_2 "REACCIONA" al realizarse un "variable.next()".
    // Por mas que este en ngOnInit, recarga los datos de la tabla,
    // si en cualquier punto del proyecto se modifica el contenido
    // de la variable. Funcionalidad reactiva asociada a 'next'.
    // PacienteCambio: para indicar esta funcionalidad reactiva.
    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.pacienteService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
    });
  }

  // tslint:disable-next-line: typedef
  eliminar(id: number) {
    this.pacienteService.eliminar(id).subscribe(() => {
      this.pacienteService.listar().subscribe(data => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  // tslint:disable-next-line: typedef
  crearTabla(data: Paciente[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // tslint:disable-next-line: typedef
  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  mostrarMas(e: any): void {
    this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
}
