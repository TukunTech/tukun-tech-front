import {Route} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';

export const historyRoutes: Route[] = [
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () => import('./pages/history').then(m => m.HistoryComponent),
  },
]
