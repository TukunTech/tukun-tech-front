import {Routes} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@feature/dashboard/ui/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  }
];
