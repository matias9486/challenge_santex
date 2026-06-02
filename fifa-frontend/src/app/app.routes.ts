import { Routes } from '@angular/router';
import { AuthenticatedGuard } from '@core/guards/authenticated.guard';
import { NotAuthenticatedGuard } from '@core/guards/non-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',        
        loadChildren: () => import('@auth/auth.routes'), //usa el export default
        canMatch: [
            NotAuthenticatedGuard, //puede ingresar sino está autenticado            
        ],
    },
    {
        path: 'players',        
        loadChildren: () => import('@players/players.routes'), //usa el export default
        canMatch: [
            AuthenticatedGuard
        ],
    }
    //ultimo iria el path vacio '' para la pagina principal
];
