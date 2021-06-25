import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material/material.module';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { BuscarComponent } from './buscar/buscar.component';
import { BuscarDialogoComponent } from './buscar/buscar-dialogo/buscar-dialogo.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ConsultaEspecialComponent } from './consulta-especial/consulta-especial.component';
import { EspecialidadComponent } from './especialidad/especialidad.component';
import { EspecialidadEdicionComponent } from './especialidad/especialidad-edicion/especialidad-edicion.component';
import { ExamenComponent } from './examen/examen.component';
import { ExamenEdicionComponent } from './examen/examen-edicion/examen-edicion.component';

import { LayoutComponent } from './layout/layout.component';
import { MedicoComponent } from './medico/medico.component';
import { MedicoDialogoComponent } from './medico/medico-dialogo/medico-dialogo.component';
import { MedicoDialogoEliminarComponent } from './medico/medico-dialogo-eliminar/medico-dialogo-eliminar.component';

import { PacienteComponent } from './paciente/paciente.component';
import { PacienteEdicionComponent } from './paciente/paciente-edicion/paciente-edicion.component';
import { ReporteComponent } from './reporte/reporte.component';
import { WizardComponent } from './wizard/wizard.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';

import { PagesRoutingModule } from './pages-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { SignoVitalComponent } from './signo-vital/signo-vital.component';
import { SignoVitalEdicionComponent } from './signo-vital/signo-vital-edicion/signo-vital-edicion.component';
import { PacienteNuevoComponent } from './signo-vital/signo-vital-edicion/paciente-nuevo/paciente-nuevo.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    PdfViewerModule
  ],
  exports: [],
  declarations: [
    PacienteComponent,
    MedicoComponent,
    PacienteEdicionComponent,
    MedicoDialogoComponent,
    MedicoDialogoEliminarComponent,
    ExamenComponent,
    ExamenEdicionComponent,
    EspecialidadComponent,
    EspecialidadEdicionComponent,
    ConsultaComponent,
    ConsultaEspecialComponent,
    WizardComponent,
    BuscarComponent,
    BuscarDialogoComponent,
    ReporteComponent,
    MiPerfilComponent,
    LayoutComponent,
    InicioComponent,
    Not403Component,
    Not404Component,
    SignoVitalComponent,
    SignoVitalEdicionComponent,
    PacienteNuevoComponent
  ],
  providers: []
})

export class PagesModule { }
