import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css']
})
export class ConsultaEspecialComponent implements OnInit {

  form: FormGroup;
  pacientes: Paciente[];
  medicos: Medico[];
  especialidades: Especialidad[];
  examenes: Examen[];

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  pacienteSeleccionado: Paciente;
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;

  // utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();

  pacientesFiltrados$: Observable<Paciente[]>;
  medicosFiltrados$: Observable<Medico[]>;

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private especialidadService: EspecialidadService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      paciente: this.myControlPaciente,
      especialidad: new FormControl(),
      medico: this.myControlMedico,
      fecha: new FormControl(new Date()),
      diagnostico: new FormControl(''),
      tratamiento: new FormControl('')
    });
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    this.medicosFiltrados$ = this.myControlMedico.valueChanges.pipe(map(val => this.filtrarMedicos(val)));
  }

  filtrarPacientes(val: any): any {
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

  filtrarMedicos(val: any): any {
    if (val != null && val.idMedico > 0) {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase())
        || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase())
        || option.cmp.includes(val.cmp));
    } else {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val?.toLowerCase())
        || option.apellidos.toLowerCase().includes(val?.toLowerCase())
        || option.cmp.includes(val));
    }
  }

  listarPacientes(): void {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  listarMedicos(): void {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarEspecialidad(): void {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarExamenes(): void {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }

  mostrarPaciente(val: Paciente): any {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  mostrarMedico(val: Medico): any {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarEsp(e: any): void {
    // console.log(e.value.idPais);
    // service.listarProvincias(idPais).subscribe( data => this.lista = data);
  }

  agregarDetalle(): void {
    if (this.diagnostico != null && this.tratamiento != null) {
      const det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico = null;
      this.tratamiento = null;
    } else {
      this.mensaje = 'Debe agregar un diagnóstico y tratamiento';
      this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
    }
  }

  agregarExamen(): void {
    if (this.examenSeleccionado) {
      let cont = 0;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        const examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
    }
  }

  removerDiagnostico(index: number): void {
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen(index: number): void {
    this.examenesSeleccionados.splice(index, 1);
  }

  estadoBotonRegistrar(): boolean {
    return (this.detalleConsulta.length === 0
      || this.especialidadSeleccionada === null
      || this.medicoSeleccionado === null
      || this.pacienteSeleccionado === null);
  }

  aceptar(): void {
    const consulta = new Consulta();
    consulta.paciente = this.form.value.paciente;
    consulta.medico = this.form.value.medico;
    consulta.especialidad = this.form.value.especialidad;
    consulta.numConsultorio = 'C1';
    consulta.fecha = moment(this.form.value.fecha).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;

    const consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open('Se registro', 'Aviso', { duration: 2000 });
      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles(): void {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.medicoSeleccionado = null;
    this.examenSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
    // para autocompletes
    this.myControlPaciente.reset();
    this.myControlMedico.reset();
  }
}
