import { Component, input, model } from '@angular/core';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

export interface AlertData {
  statusCode: number;
  statusName: string;
  message: string | string[];
  type?: AlertType;
}

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
 // Un 'model' en Angular es una Signal especial que permite comunicación de doble vía.
  // Al usar '.required', obligamos al padre a pasar el dato. 
  // Al permitir '| null', dejamos que el estado inicial o final sea "vacío" (sin alerta).  
  message = model.required<AlertData | null>();

  // Input para controlar si alert se puede cerrar. Por defecto es true, pero el padre puede pasarle false.
  dismissible = input<boolean>(true);

  // Esto es un truco estándar para poder usar métodos globales como Array.isArray en el HTML
  protected readonly Array = Array;
}
