import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-list-page',
  imports: [],
  templateUrl: './player-list-page.component.html',
  styleUrl: './player-list-page.component.css'
})
export class PlayerListPageComponent implements OnInit{
  // Captura el 'mode' de la ruta activa ('list', 'edit', o 'details')
  @Input() mode: 'list' | 'edit' | 'details' | 'skill-evolution' | 'evolution-ia' = 'list'; 

  ngOnInit(): void {
    console.log(this.mode);
  }
  
}
