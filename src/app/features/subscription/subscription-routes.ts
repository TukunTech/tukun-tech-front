import {Route} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';

export const subscriptionRoutes: Route[] = [
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () => import('./pages/subscription').then(m => m.SubscriptionComponent),
  },
]
