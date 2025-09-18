import {Routes} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';
import {roleMatch} from '@core/guards/role.match.guard';

export const attendantDashboardRoutes: Routes = [
  {
    path: '',
    canMatch: [authGuard, roleMatch(['ATTENDANT'])],
    loadComponent: () =>
      import('../ui/components/dashboard-attendant.component').then(m => m.DashboardAttendantComponent),
  },
];
