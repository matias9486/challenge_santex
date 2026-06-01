import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { NO_TOKEN_REQUIRED } from '@core/context/auth.context';
import { environment } from '@environments/environment.development';
import { AuthUser } from '@core/models/auth-user.interface';
import { AuthResponse } from '@core/models/auth-response.interface';


type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //---definición de signals---
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<AuthUser | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  //---inyecciones de dependencias---
  private http = inject(HttpClient);

  checkStatusResource = rxResource( {
    loader: () => this.checkStatus(),
  });

  //---variables con los valores de los signals---
  authStatus = computed<AuthStatus> (() => {
      if( this._authStatus() === 'checking') return 'checking';

      if (this._user())
        return 'authenticated';

      return 'not-authenticated';
  });
  user = computed<AuthUser | null> (() => this._user());
  token = computed<string | null> (() => this._token());

  //---Métodos del service---
  //Retorna un observable booleano que indica si pudo loguearse
  login(email: string, password: string): Observable<boolean> {
    //API retorna un AuthResponse con los datos de usuario y token.
    return this.http.post<AuthResponse>(
      `${baseUrl}/auth/login`, 
      { email: email, password: password },       
      NO_TOKEN_REQUIRED //helper propio que usamos en nuestro auth interceptor
    )
    .pipe(
      tap( (resp) => this.handleAuthSuccess(resp)),
      map(() => true),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  //check authentication. Lo usaré con checkStatusResource
  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token) {
      this.logout();
      return of(false);
    }

    //petición con bearer token. Usamos el AuthInterceptor
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`)
    .pipe(
      tap( (resp) => this.handleAuthSuccess(resp)),
      map(() => true),
      catchError((error: any) => this.handleAuthError(error))
    );
  }
  
  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }
  //registro

  //helpers
  private handleAuthSuccess( data: AuthResponse) {
    this._user.set({
      id: data.id,
      fullName: data.fullName,
      roles: data.roles
    });
    this._token.set(data.token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', data.token);
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
