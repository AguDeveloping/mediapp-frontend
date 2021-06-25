import { Component, OnInit } from '@angular/core';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { Chart } from 'chart.js';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  tipo = 'line';
  chart: any;

  pdfSrc: string;
  nombreArchivo: string;
  archivosSeleccionados: FileList;

  imagenEstado = false;
  imagenData: any;

  constructor(
    private consultaService: ConsultaService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.consultaService.leerArchivo().subscribe(data => {
      this.convertir(data);
    });

    this.dibujar();
  }

  convertir(data: any): void {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      const base64 = reader.result;
      console.log(base64);
      this.sanar(base64);
    };
  }

  sanar(base64: any): void {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    this.imagenEstado = true;
  }

  cambiar(tipo: string): void {
    this.tipo = tipo;
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.dibujar();
  }

  dibujar(): void {
    this.consultaService.listarResumen().subscribe(data => {
      const cantidades = data.map(x => x.cantidad);
      const fechas = data.map(x => x.fecha);

      console.log(cantidades);
      console.log(fechas);

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Cantidad',
              data: cantidades,
              borderColor: '#3cba9f',
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ]
            }
          ]
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }
            }],
          }
        }
      });

    });
  }

  // PDFs
  generarReporte(): void {
    this.consultaService.generarReporte().subscribe(data => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log(this.pdfSrc);
      };
      reader.readAsArrayBuffer(data);
    });
  }

  descargarReporte(): void {
    this.consultaService.generarReporte().subscribe(data => {
      const url = window.URL.createObjectURL(data);
      // console.log(url);
      const a = document.createElement('a');
      a.setAttribute('display', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'archivo.pdf';
      a.click();
    });
  }

  seleccionarArchivo(e: any): void {
    this.nombreArchivo = e.target.files[0].name;
    this.archivosSeleccionados = e.target.files;
  }

  subirArchivo(): void {
    this.consultaService.guardarArchivo(this.archivosSeleccionados.item(0)).subscribe();
  }
}
