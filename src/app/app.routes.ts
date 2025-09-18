import {Routes} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';
import {activeAccountGuard} from '@core/guards/active-account.guard';
import {MainLayoutComponent} from '@layout/main-layout/main-layout.component';
import {redirectToRoleHomeGuard} from '@core/guards/redirect-to-role-home.guard';
import {RedirectToRoleComponent} from '@core/components/redirect-to-role/edirect-to-role.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard, activeAccountGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      { path: 'dashboard', component: RedirectToRoleComponent, canActivate: [redirectToRoleHomeGuard] },

      {
        path: 'dashboard/admin',
        loadChildren: () =>
          import('@feature/dashboard/admin/routes/admin.routes').then(m => m.adminDashboardRoutes),
      },
      {
        path: 'dashboard/attendant',
        loadChildren: () =>
          import('@feature/dashboard/attendant/routes/attendant.routes').then(m => m.attendantDashboardRoutes),
      },
      {
        path: 'dashboard/patient',
        loadChildren: () =>
          import('@feature/dashboard/patient/routes/patient.routes').then(m => m.patientDashboardRoutes),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@feature/auth/routes/auth.routes').then(m => m.authRoutes),
  },
  { path: '403', loadComponent: () => import('@shared/pages/forbidden/forbidden.component').then(m => m.ForbiddenPage) },
  { path: '404', loadComponent: () => import('@shared/pages/not-found/not-found.component').then(m => m.NotFoundPage) },
  { path: '**', redirectTo: 'dashboard' },
];
