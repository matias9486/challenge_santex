import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@core/guards/non-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',        
        loadChildren: () => import('@auth/auth.routes'), //usa el export default
        canMatch: [
            NotAuthenticatedGuard, //puede ingresar sino está autenticado            
        ],
    }
    //ultimo iria el path vacio '' para la pagina principal
];
