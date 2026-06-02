import { NgClass } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { saveAs } from 'file-saver';

import { FilterPlayer, PaginatedPlayers, Player } from '@players/interfaces';
import { PlayerService } from '@players/services/player.service';
import { AlertComponent, AlertData } from '@shared/alert/alert.component';
import { SpinnerComponent } from '@shared/spinner/spinner.component';


@Component({
  selector: 'app-player-list-page',
  imports: [ReactiveFormsModule, NgClass, RouterLink, SpinnerComponent, AlertComponent],
  templateUrl: './player-list-page.component.html',
  styleUrl: './player-list-page.component.css'
})
export class PlayerListPageComponent implements OnInit{
  // Captura el 'mode' de la ruta activa ('list', 'edit', o 'details') 
  @Input() mode: 'list' | 'edit' | 'details' | 'skill-evolution' | 'evolution-ia' = 'list'; 
  isLoading = false;  //evita el reenderizado antes que termine petición
  backendResponseSignal = signal< AlertData | null>(null);
  players: Player[] = [];
  isDownloading = false; //para deshabilitar botón de descarga

  //variables auxiliares para mostrar o no los filtros
  hasInitialPlayers: boolean = false; // Nueva variable para controlar el estado inicial
  private isFirstLoad: boolean = true; // Auxiliar para saber si es la carga inicial

  private playerService: PlayerService = inject(PlayerService);
  private fb = inject(FormBuilder);
  
  misFiltros: FilterPlayer = {};
  paginatedPlayers!: PaginatedPlayers;

  // 2. Definimos el formulario con valores iniciales vacíos (opcionales)
  filterForm = this.fb.group({
    name: [''],
    club: [''],    
    page: [1],      // Valores por defecto para la paginación
    limit: [10]
  });

  ngOnInit(): void {    
    this.loadPlayers();        
  }

  loadPlayers() {    
    this.isLoading = true; // 1. Empezamos a cargar
    // Obtiene el objeto con los valores actuales del formulario
    const formValues = this.filterForm.value;

    // Construimos el DTO asegurando que cumpla con la interfaz
    const filters: FilterPlayer = {
      name: formValues.name || undefined,
      club: formValues.club || undefined,      
      page: formValues.page || undefined,
      limit: formValues.limit || undefined,
    };    

    this.playerService.getAllPlayers(filters).subscribe({
      next: (data) => {
        this.paginatedPlayers = data;
        this.players = data.data;        
        this.isLoading = false;

        // Solo en la primera carga verificamos si existen jugadores en el sistema
        if (this.isFirstLoad) {
          this.hasInitialPlayers = this.players.length > 0;
          this.isFirstLoad = false; // Ya no es la primera carga
        }
      },
      error: (err) => {
        this.isLoading = false;
        let message: string | string [] = err.error.message || 'Unknown Error';
            
        this.backendResponseSignal.set({
          statusCode: err.error.statusCode, // Angular extrae el código HTTP aquí (ej. 404, 500)
          message: message, 
          statusName: err.error.error, // El nombre del estado (ej. "Not Found", "Internal Server Error")
          type: 'danger'                        
        });        
      }
    });
  }
  
  onFilter(): void {
    // Al filtrar, reseteamos a la página 1
    this.filterForm.patchValue({ page: 1 }, { emitEvent: false });
    this.loadPlayers();
  }

  onClearFilters(): void {
    // 1. Reseteamos el formulario a sus valores vacíos por defecto
    this.filterForm.reset({
      name: '',
      club: '',
      page: 1
    }, { emitEvent: false }); // Evitamos disparar eventos innecesarios mientras se limpia

    this.loadPlayers();
  }
  
  onDownload() {
    this.isDownloading = true;
    
    // Obtiene el objeto con los valores actuales del formulario
    const formValues = this.filterForm.value;

    // Construimos el DTO asegurando que cumpla con la interfaz
    const filters: FilterPlayer = {
      name: formValues.name || undefined,
      club: formValues.club || undefined,      
      page: formValues.page || undefined,
      limit: formValues.limit || undefined,
    };    

    this.playerService.downloadCsvPlayers(filters).subscribe({
      next: (blob: Blob) => {
        saveAs(blob, `players_${new Date().getTime()}.csv`);
        this.isDownloading = false;
      },
      error: (err) => {                
        let message: string | string [] = err.error.message || 'Error downloading file';
        this.backendResponseSignal.set({
          statusCode: err.error.statusCode,
          message: message, 
          statusName: err.error.error || 'An Error ocurred',
          type: 'danger'                        
        });    
        this.isDownloading = false;
      }
    });
  }

  changePage(page: number | string): void {
    // Si hacen clic en "...", no hacemos nada
    if (typeof page === 'string') return;

    const totalPages = this.paginatedPlayers.meta.totalPages;
    if (page >= 1 && page <= totalPages) {
      this.filterForm.patchValue({ page }, { emitEvent: false });
      this.loadPlayers();      
    }
  }
  
  get pagesToShow(): (number | string)[] {
    if (!this.paginatedPlayers || !this.paginatedPlayers.meta) return [];

    const current = this.paginatedPlayers.meta.currentPage;
    const total = this.paginatedPlayers.meta.totalPages;
    const paginas: (number | string)[] = [];

    // Siempre agregamos la página 1
    paginas.push(1);

    if (current > 2) {
      // Si estamos más allá de la página 2, metemos los puntos suspensivos
      paginas.push('...');
    }

    // Agregamos la página actual si no es la primera ni la última
    if (current > 1 && current < total) {
      paginas.push(current);
    } else if (current === 1 && total > 1) {
      // Si estamos en la 1 y hay más páginas, sugerimos la siguiente (pág 2) para rellenar el hueco del "3"
      if (total > 2) paginas.push(2);
    }

    // Si falta mucho para llegar al final, podrías agregar otros '...' aquí.
    // Pero siguiendo tu estructura estricta de [1] [...] [X], añadimos la última si existe
    if (total > 1 && current < total) {
      // Si la página actual ya es la última o la penúltima, evitamos duplicados
      if (current !== total - 1 && current !== total) {
        // Mostramos el final dinámico
        paginas.push(total); 
      } else {
        paginas.push(total);
      }
    } else if (total > 1) {
      paginas.push(total);
    }

    // Limpiamos duplicados por si acaso el cálculo se cruza en números bajos (ej. total de páginas < 3)
    return [...new Set(paginas)].sort((a, b) => {
      if (typeof a === 'string' || typeof b === 'string') return 0; // mantener orden relativo del string
      return a - b;
    });
  }
}
