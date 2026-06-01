import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AlertComponent, AlertData } from '@shared/alert/alert.component';
import { FormUtils } from '@utils/form-utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnDestroy {  
  fb = inject(FormBuilder);

  showPassword = signal<boolean>(false); // Signal para mostrar o no el password
  isProcessing: boolean = false; //para controlar estado de la petición

  /* Definimos rta back como un Signal.. lo usamos como two way data binding en el componente alert-message. 
  Desde alla, le cambio estado al cerrar alert. Por eso le paso el signal entero(sin parentesis)
  Empieza en 'null' para que la alerta no se muestre hasta que ocurra un evento (ej. un clic o un error).
  */
  backendResponseSignal = signal< AlertData | null>(null);
  
  formUtil = FormUtils;
  suscription: Subscription = new Subscription();
  
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]]
  });

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  onSubmit(){
     // Control de seguridad: Si ya se está procesando una petición, bloqueamos la ejecución de inmediato
    if (this.isProcessing) {      
      this.backendResponseSignal.set({
            statusCode: 0,
            message: 'Saving in progress', 
            statusName: 'Information',
            type: 'info'
          });
      return;
    }

    if( this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.backendResponseSignal.set({
        statusCode: 0,
        message: "Please verify the information entered.", 
        statusName: "Invalid Form",
        type: 'danger'                        
      });      
      return;
    }

    this.isProcessing = true;        
    const { email = "", password ="", fullName = ""} = this.registerForm.value;
    
    this.suscription.add(
      this.authService.register(email!, password!, fullName!).subscribe(
        {
          next: (data) => {
            // 1. Se ejecuta esto cuando llega el JSON                      
            console.log("Guardado:", data);
            // 2. Rediriges a la vista de login o presentación
            this.router.navigateByUrl('/');
          },
          error: (err) => {            
            console.error("Fallo la petición", err);          
            let message: string | string [] = err.error.message || 'Unknown Error';
            
            this.backendResponseSignal.set({
              statusCode: err.error.statusCode, // Angular extrae el código HTTP aquí (ej. 404, 500)
              message: message, 
              statusName: err.error.error, // El nombre del estado (ej. "Not Found", "Internal Server Error")
              type: 'danger'                        
            });          
            
            this.isProcessing = false; // Desbloqueamos siempre al terminar
          },
          complete: () => {                        
            this.isProcessing = false; // Desbloqueamos siempre al terminar
          }
        }
      )
    );
  }

  //Método para mostrar el password
  togglePassword(): void {
    this.showPassword.update(value => !value);
  }
}

