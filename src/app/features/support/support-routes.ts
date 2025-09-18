import {Route} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';

export const supportRoutes: Route[] = [
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () => import('./pages/support').then(m => m.SupportComponent),
  },
]
