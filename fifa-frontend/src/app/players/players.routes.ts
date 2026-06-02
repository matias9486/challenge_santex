import { Routes } from '@angular/router';
import { PlayerListPageComponent } from './pages/player-list-page/player-list-page.component';
import { PlayerFormPageComponent } from './pages/player-form-page/player-form-page.component';
import { PlayerDetailsPageComponent } from './pages/player-details-page/player-details-page.component';
import { PlayerLayoutComponent } from './layout/player-layout/player-layout.component';

export const playerRoutes: Routes = [
    {
        path: '',
        component: PlayerLayoutComponent, // Este es el componente Padre que tiene el <router-outlet>
        children: [
            {
                path: '',
                component: PlayerListPageComponent,
                data: { mode: 'list' },
            },
            //-----rutas adicionales para pasar información al componente. Mostrar botón correspondiente del listado--------
            {
                path: 'edit',
                component: PlayerListPageComponent,
                data: { mode: 'edit' }, // El navbar activa esto para mostrar los botones de "Editar"
            },
            {
                path: 'details',
                component: PlayerListPageComponent,
                data: { mode: 'details' }, // El navbar activa esto para mostrar los botones de "Ver Detalles"
            },
            //rutas dinamicas al final para que pueda tomar las rutas con data
            {
                path: 'new',
                component: PlayerFormPageComponent,
            },
            {
                path: ':id/edit',
                component: PlayerFormPageComponent,
            },
            {
                path: ':id',
                component: PlayerDetailsPageComponent,
            },

            {
                path: '**',
                redirectTo: '', // Lo manda a /players (que mapea con el PlayerListPageComponent)
                pathMatch: 'full',
            },
        ]
    }
];

export default playerRoutes; //simplifica la carga perezosa.
