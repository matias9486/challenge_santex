import { Component, model } from '@angular/core';

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

  // Esto es un truco estándar para poder usar métodos globales como Array.isArray en el HTML
  protected readonly Array = Array;
}
