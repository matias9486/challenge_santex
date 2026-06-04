import { TitleCasePipe } from '@angular/common';
import { Component, inject, Input, numberAttribute, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PLAYER_POSITIONS } from '@players/constants/positions.constant';
import { SKILL_FIELDS } from '@players/constants/skills.constant';
import { Player } from '@players/interfaces';
import { PlayerService } from '@players/services/player.service';
import { AlertData, AlertComponent } from '@shared/alert/alert.component';
import { SpinnerComponent } from '@shared/spinner/spinner.component';
import { FormUtils } from '@utils/form-utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-form-page',
  imports: [ReactiveFormsModule, AlertComponent, SpinnerComponent, TitleCasePipe],
  templateUrl: './player-form-page.component.html',
  styleUrl: './player-form-page.component.css'
})
export class PlayerFormPageComponent implements OnInit{
// PARA EDICION: obtiene el id de la ruta. Activar la opción withComponentInputBinding() en la configuración de enrutador.
  @Input({ transform: numberAttribute }) id!: number;
  @Input() mode: 'create' | 'edit' = 'create';

  isEditMode = false;
  isLoading = false;
  hasLoadError = false;

  // Inyección moderna del Router de Angular
  private router = inject(Router);
  private playerService = inject(PlayerService);
  suscription: Subscription = new Subscription();
  isProcessing: boolean = false; //para controlar estado de la petición  

  fb = inject(FormBuilder);
  formUtil = FormUtils; //helper de validaciones de form

  // Definimos rta back como un Signal.. lo usamos como two way data binding en el componente alert-message. 
  // Desde alla, le cambio estado al cerrar alert. Por eso le paso el signal entero(sin parentesis)
  // Empieza en 'null' para que la alerta no se muestre hasta que ocurra un evento (ej. un clic o un error).
  messaggeBackend = signal< AlertData | null>(null);  
  player!: Player;
  playerForm!: FormGroup;

  readonly positions = PLAYER_POSITIONS;
  //Definimos las listas de campos para iterar
  readonly skillFields = SKILL_FIELDS;

  ngOnInit(): void {
    // 1. Si el modo es crear, ignoramos cualquier ID y cargamos el formulario
    if (this.mode === 'create') {
      this.isEditMode = false;    
      this.initForm();
      return;
    }
      
    if (this.id !== undefined && (isNaN(this.id) || this.id === 0)) {      
        this.isEditMode = true;
        this.hasLoadError = true;
        this.messaggeBackend.set({
          statusCode: 400,
          message: 'Player ID is not valid.',
          statusName: 'Bad Request',
          type: 'danger'
        });
        return;
    }

    this.isEditMode = !!this.id;
    this.initForm();

    if (this.isEditMode && this.id) {      
      this.isLoading = true;
      this.playerService.getPlayerById(this.id).subscribe({
        next: (player) => {          
          // 1. Cargamos todos los valores en el formulario
          this.playerForm.patchValue(player);

          // 2. Si es modo edición, deshabilitamos los dos campos específicos. No permito editarlos
          this.playerForm.get('fifaVersion')?.disable();
          this.playerForm.get('playerId')?.disable();
          this.isLoading = false;
        },
        error: (err) => {                 
            let message: string | string [] = err.error.message || 'Unknown Error';
            this.messaggeBackend.set({
              statusCode: err.error.statusCode,
              message: message, 
              statusName: err.error.error,
              type: 'danger'            
            });                      
            this.isLoading = false;
            this.hasLoadError = true;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  //Creamos el formulario
  initForm() {
    this. playerForm= this.fb.group({      
    
        //personal data
        shortName: ['', [Validators.required, Validators.minLength(5)]],
        longName: ['', [Validators.required, Validators.minLength(5)]],
        /*
        En la definición(form): Usas / \d / porque es una Expresión Regular nativa.
        En la comparación(util): Usas ' \\d ' porque estás comparando contra un String que representa esa expresión, y en los strings, las barras invertidas deben escaparse.
        */
        birthDate: ['1986-04-09', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
        preferredFoot: ['Right', [Validators.required]],
        playerFaceUrl: ['https://cdn.sofifa.net/player_0.png', [Validators.required]], //string requerido no puede ser vacio
        nationalityName: ['Argentina', [Validators.required, Validators.minLength(3)]],
        
        //fifa data
        fifaVersion: [23, [Validators.required, Validators.min(15), Validators.max(23)]],
        playerId: [1, [Validators.required, Validators.min(1)]],
        clubName: ['Unknown', [Validators.required, Validators.minLength(3)]],
        playerPositions: ['CF', [Validators.required, Validators.minLength(2)]],
        valueEur: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]],

        //skills
        ...this.generateSkillControls(),
        
    });
  }
  
  private generateSkillControls() {
    const group: any = {};
    this.skillFields.forEach(skill => {
      group[skill] = [50, [Validators.required, Validators.min(1), Validators.max(100)]];
    });
    return group;
  }

  onSubmit() {
    // 1. Control de seguridad: Si ya se está procesando una petición, bloqueamos la ejecución de inmediato
    if (this.isProcessing) {
      this.messaggeBackend.set({
            statusCode: 0,
            message: 'Saving in progress', 
            statusName: 'Information',
            type: 'info'
      });      
      return;
    }

    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      this.messaggeBackend.set({
            statusCode: 0,
            message: 'Check form fields', 
            statusName: 'Invalid Form',
            type: 'danger'
      });      
      return;
    }    
    
    this.player = this.playerForm.value;
    this.isProcessing = true;   //controla estado peticion y del boton guardar    

    if (this.isEditMode) {
      this.suscription.add(
        this.playerService.updatePlayer(this.id, this.player).subscribe({
          next: (data) => {            
            this.player = data;            
            this.router.navigate(['/players',this.player.id]);
          },
          error: (err) => {            
            let message: string | string [] = err.error.message || 'Unknown Error';
            this.messaggeBackend.set({
              statusCode: err.error.statusCode,
              message: message, 
              statusName: err.error.error,
              type: 'danger'            
            });                      
            this.isProcessing = false; // Desbloqueamos siempre al terminar
          },
          complete: () => {            
            this.isProcessing = false; // Desbloqueamos siempre al terminar
          }
        })
      );
    }else {
      this.suscription.add(
        this.playerService.postHttpClient(this.player).subscribe({
          next: (data) => {            
            this.player = data;                    
            this.router.navigate(['/players',this.player.id]);
          },
          error: (err) => {                                
            let message: string | string [] = err.error.message || 'Unknown Error';
            this.messaggeBackend.set({
              statusCode: err.error.statusCode,
              message: message, 
              statusName: err.error.error,
              type: 'danger'            
            });                      
            this.isProcessing = false;

          },
          complete: () => {            
            this.isProcessing = false;
          }
        })
      );
    }
  }  
}
