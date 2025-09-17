import {Routes} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';
import {roleMatch} from '@core/guards/role.match.guard';

export const patientDashboardRoutes: Routes = [
  {
    path: '',
    canMatch: [authGuard, roleMatch(['PATIENT'])],
    loadComponent: () =>
      import('../ui/components/dashboard-patient.component').then(m => m.DashboardPatientComponent),
  },
];
