import {Route} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';

export const vitalSignsRoutes: Route[] = [
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () => import('./pages/vital-signs').then(m => m.VitalSignsComponent),
  }
]
