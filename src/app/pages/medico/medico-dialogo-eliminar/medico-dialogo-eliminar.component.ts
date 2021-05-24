import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from 'src/app/_service/medico.service';

@Component({
  selector: 'app-medico-dialogo-eliminar',
  templateUrl: './medico-dialogo-eliminar.component.html',
  styleUrls: ['./medico-dialogo-eliminar.component.css']
})
export class MedicoDialogoEliminarComponent implements OnInit {

  medico: Medico;

  constructor(
    private dialogRef: MatDialogRef<MedicoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Medico,
    private medicoService: MedicoService
  ) { }

  ngOnInit(): void {
    this.medico = { ...this.data };
  }

  eliminar(): void {
    this.medicoService.eliminar(this.medico.idMedico).pipe(switchMap(() => {
      return this.medicoService.listar();
    }))
      .subscribe(data => {
        this.medicoService.setMensajeCambio('SE ELIMINO');
        this.medicoService.setMedicoCambio(data);
      });
    this.cerrar();
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
