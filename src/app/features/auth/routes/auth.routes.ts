import {guestGuard} from '@core/guards/guest.guard';
import {Routes} from '@angular/router';


export const authRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../ui/pages/login/login.page').then(m => m.LoginPage),
  },
  {path: '', pathMatch: 'full', redirectTo: 'login'},
];
