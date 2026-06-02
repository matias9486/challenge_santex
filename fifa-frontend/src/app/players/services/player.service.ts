import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { FilterPlayer, PaginatedPlayers } from '@players/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private baseUrl = environment.baseUrl;
  
  private http = inject(HttpClient);
  
  getAllPlayers(filters?: FilterPlayer): Observable<PaginatedPlayers> {
    let params = new HttpParams();

    if (filters) {
      // Recorremos las llaves del objeto para armar los query params dinámicamente
      Object.entries(filters).forEach(([key, value]) => {
        // Validamos que el valor no sea null, undefined o un string vacío
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    // Pasamos los params en las opciones del GET
    return this.http.get<PaginatedPlayers>(`${this.baseUrl}/players`, { params });
  }
}
