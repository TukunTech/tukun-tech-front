import {Route} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';
import {PatientProfileResolver} from '@feature/patient/data/patient-profile.resolver';

export const patientRoutes: Route[] = [
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./pages/patient').then(m => m.PatientComponent),
    resolve: {preload: PatientProfileResolver},
  },
  {
    path: 'update',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./components/patient/patient-info-update/patient-personal-info-update.component')
        .then(m => m.PatientPersonalInfoUpdateComponent),
  },
];
