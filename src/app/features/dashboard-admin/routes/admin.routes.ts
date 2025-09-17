import {authGuard} from '@core/guards/auth.guard';
import {roleMatch} from '@core/guards/role.match.guard';
import {Routes} from '@angular/router';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    canMatch: [authGuard, roleMatch(['ADMINISTRATOR'])],
    loadComponent: () =>
      import('../ui/components/dashboard-admin.component').then(m => m.DashboardAdminComponent),
  },
];
