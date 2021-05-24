import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from 'src/app/_service/medico.service';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';
import { switchMap } from 'rxjs/operators';
import { MedicoDialogoEliminarComponent } from './medico-dialogo-eliminar/medico-dialogo-eliminar.component';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  displayedColumns = ['idmedico', 'nombres', 'apellidos', 'cmp', 'acciones'];
  dataSource: MatTableDataSource<Medico>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private medicoService: MedicoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.medicoService.getMedicoCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.medicoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.medicoService.listar().subscribe(data => {
      this.crearTabla(data);
    });
  }

  // tslint:disable-next-line: typedef
  crearTabla(data: Medico[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // tslint:disable-next-line: typedef
  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  // tslint:disable-next-line: typedef
  abrirDialogo(medico?: Medico) {
    this.dialog.open(MedicoDialogoComponent, {
      width: '250px',
      data: medico
    });
  }

  // tslint:disable-next-line: typedef
  eliminar(medico: Medico) {
    this.dialog.open(MedicoDialogoEliminarComponent, {
      width: '250px',
      data: medico
    });
  }

  // ori
  // eliminar(medico: Medico) {
  //   this.medicoService.eliminar(medico.idMedico).pipe(switchMap(() => {
  //     return this.medicoService.listar();
  //   }))
  //     .subscribe(data => {
  //       this.medicoService.setMensajeCambio('SE ELIMINO');
  //       this.medicoService.setMedicoCambio(data);
  //     });
  // }

}
