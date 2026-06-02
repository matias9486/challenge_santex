import { Component, ElementRef, input, numberAttribute, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Player } from '@players/interfaces';
import { PlayerService } from '@players/services/player.service';
import { AlertComponent, AlertData } from '@shared/alert/alert.component';
import { SpinnerComponent } from '@shared/spinner/spinner.component';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-details-page',
  imports: [SpinnerComponent, AlertComponent],
  templateUrl: './player-details-page.component.html',
  styleUrl: './player-details-page.component.css'
})
export class PlayerDetailsPageComponent implements OnInit, OnDestroy {
  // Uso signal y obtengo el id de la ruta gracias al withComponentInputBinding() del provideRouter
  // Convierte el string a number
  id = input.required({ transform: numberAttribute });

  subscription: Subscription = new Subscription();
  isLoading = false;  //evita el reenderizado antes que termine petición
  player!: Player;

  error: AlertData | null = null;

  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  /*
  registerables: Si no usas Chart.register(...registerables), el gráfico no se renderizará porque las escalas y elementos de dibujo no estarán cargados. Es un error común al migrar de versiones viejas.
  Nunca intentes crear el gráfico en el OnInit. En ese punto, el #radarCanvas todavía es undefined porque el HTML no se ha dibujado.
  */
  constructor(
    private playerService: PlayerService,    
  ) {    
    // Registramos los componentes necesarios de Chart.js
    Chart.register(...registerables);    
  }

  ngOnInit(): void {    
    this.obtenerPorId(this.id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    if (this.chart) {
      this.chart.destroy(); // Evita memory leaks si el componente se destruye
    }
  }

  obtenerPorId(id:number) {    
    this.isLoading = true; // 1. Empezamos a cargar
    this.error = null;     // Limpiamos errores previos    

    this.subscription.add(
      this.playerService.getPlayerById(id).subscribe({
        next: (data) => {                    
          this.player = data;
          this.isLoading = false;
          //da tiempo a reenderizar el grafico
          setTimeout(() => {
            this.createChart();
          }, 1);
        },
        error: (err) => {          
          this.error = {           
              statusCode: err.error.statusCode, // Angular extrae el código HTTP aquí (ej. 404, 500)
              message: err.error.message, 
              statusName: err.error.error, // El nombre del estado (ej. "Not Found", "Internal Server Error")
              type: 'danger'            
            };  
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    );
  }

  createChart() {
    const data = {
        labels: [
          'Overall',
          'Potential',
          'Speed',
          'Shooting',
          'Passing',
          'Dribbling',                    
          'Defending',
          'Physic'
        ],
        datasets: [{
          label: 'Fifa ' + this.player.fifaVersion,
          data: [ this.player.overall, this.player.potential, this.player.pace, this.player.shooting, this.player.passing, this.player.dribbling, this.player.defending, this.player.physic],
          fill: true,
          backgroundColor: 'rgba(46, 90, 209, 0.2)',
          borderColor: 'rgb(46, 90, 209)',
          pointBackgroundColor: 'rgb(46, 90, 209)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(46, 90, 209)',
        }      
      ]
    };

    const configRadar: ChartConfiguration = {
      type: 'radar',
      data: data,  
      options: {
        responsive: true,
        maintainAspectRatio: false, // Permite que el canvas se ajuste al contenedor. True obedece a canvas, false al css
        //para forzar que figuren la escala de 0 a 100
        scales: {
          r: { // 'r' es la escala para gráficos de Radar
            min: 0,      // Valor mínimo forzado
            max: 100,    // Valor máximo forzado
            //configuración de la escala.. 0-100
            ticks: {
              stepSize: 10, // Fuerza que las líneas aparezcan de 10 en 10 (0, 10, 20...)
              display: true, // Asegura que se vean los números              
              font: {
                size: 12,
                weight: 'bold'
              },
              backdropColor: 'rgba(255, 255, 255, 0.75)'
            },
            pointLabels: {
              font: {
                size: 14,
                weight: 'bold' // Aplica negrita
              },
              color: '#333' // Opcional: un color más fuerte para que resalte
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)' // Color de las líneas del radar
            },
            angleLines: {
              display: true // Las líneas que van del centro a las esquinas
            },
            suggestedMin: 0, // Opcional: asegura el inicio en 0 si los datos son positivos
            suggestedMax: 100
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Skills',
            font: {
                size: 14,
                weight: 'bold' // Estilo negrita
              },
          }
        }
      },
    };

    this.chart = new Chart(this.radarCanvas.nativeElement, configRadar);
  }
}
