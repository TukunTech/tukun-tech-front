import {Route} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';


export const patientRoutes: Route[] = [
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./pages/patient').then(m => m.PatientComponent),
  }
]
