import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from 'src/app/_service/medico.service';
import { switchMap } from 'rxjs/operators';
// import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico: Medico;

  constructor(
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Medico,
    private medicoService: MedicoService
  ) { }

  ngOnInit(): void {
    this.medico = { ...this.data };
    // this.medico = this.data;
    /* this.medico = new Medico();
    this.medico.idMedico = this.data.idMedico;
    this.medico.nombres = this.data.nombres;
    this.medico.apellidos = this.data.apellidos;
    this.medico.cmp = this.data.cmp;
    this.medico.fotoUrl = this.data.fotoUrl; */
  }

  operar(): void {
    if (this.medico != null && this.medico.idMedico > 0) {
      // Modificar.
      this.medicoService.modificar(this.medico).pipe(switchMap(() => {
        return this.medicoService.listar();
      }))
        .subscribe(data => {
          this.medicoService.setMedicoCambio(data);
          this.medicoService.setMensajeCambio('SE MODIFICO');
        });

    } else {
      // Registrar.
      this.medicoService.registrar(this.medico).subscribe(() => {
        this.medicoService.listar().subscribe(data => {
          this.medicoService.setMedicoCambio(data);
          this.medicoService.setMensajeCambio('SE REGISTRO');
        });
      });
    }
    this.cerrar();
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
