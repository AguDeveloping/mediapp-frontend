import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';
import { Consulta } from 'src/app/_model/consulta';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;
  medicos$: Observable<Medico[]>;
  especialidades$: Observable<Especialidad[]>;
  examenes$: Observable<Examen[]>;

  idPacienteSeleccionado: number;
  idMedicoSeleccionado: number;
  idEspecialidadSeleccionado: number;
  idExamenSeleccionado: number;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  diagnostico: string;
  tratamiento: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();
  }

  agregar(): void {
    if (this.diagnostico != null && this.tratamiento != null) {
      const det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;

      this.detalleConsulta.push(det);

      this.diagnostico = null;
      this.tratamiento = null;
    }
  }

  agregarExamen(): void {
    if (this.idExamenSeleccionado > 0) {

      let cont = 0;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        const examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        const mensaje = 'El examen se encuentra en la lista';
        this.snackBar.open(mensaje, 'Aviso', { duration: 2000 });
      } else {
        this.examenService.listarPorId(this.idExamenSeleccionado).subscribe(data => {
          this.examenesSeleccionados.push(data);
        });
      }
    }
  }

  aceptar(): void {
    const medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;

    const especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;

    const paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    const consulta = new Consulta();
    consulta.medico = medico;
    consulta.paciente = paciente;
    consulta.especialidad = especialidad;
    consulta.numConsultorio = 'C1';
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    // ISODate
    /*let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();
    console.log(localISOTime);
    consulta.fecha = localISOTime*/

    const dto = new ConsultaListaExamenDTO();
    dto.consulta = consulta;
    dto.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(dto).subscribe(() => {
      this.snackBar.open('SE REGISTRO', 'AVISO', { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles(): void {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = null;
    this.tratamiento = null;
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }

  listarPacientes(): void {
    // this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.pacientes$ = this.pacienteService.listar();
  }

  estadoBotonRegistrar(): boolean {
    return (this.detalleConsulta.length === 0
      || this.idEspecialidadSeleccionado === 0
      || this.idMedicoSeleccionado === 0
      || this.idPacienteSeleccionado === 0);
  }

  removerDiagnostico(index: number): void {
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen(index: number): void {
    this.examenesSeleccionados.splice(index, 1);
  }

  listarMedicos(): void {
    this.medicos$ = this.medicoService.listar();
  }

  listarEspecialidad(): void {
    this.especialidades$ = this.especialidadService.listar();
  }

  listarExamenes(): void {
    this.examenes$ = this.examenService.listar();
  }

}
