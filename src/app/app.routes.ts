import {Routes} from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';
import {activeAccountGuard} from '@core/guards/active-account.guard';
import {MainLayoutComponent} from '@layout/main-layout/main-layout.component';
import {redirectToRoleHomeGuard} from '@core/guards/redirect-to-role-home.guard';
import {RedirectToRoleComponent} from '@core/components/redirect-to-role/edirect-to-role.component';
import {profileExistsGuard} from '@core/guards/profile-exists.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard, activeAccountGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'},

      {
        path: 'dashboard',
        component: RedirectToRoleComponent,
        canActivate: [redirectToRoleHomeGuard],
      },
      {
        path: 'dashboard/admin',
        loadChildren: () =>
          import('@feature/dashboard/admin/routes/admin.routes').then(
            (m) => m.adminDashboardRoutes
          ),
      },
      {
        path: 'dashboard/attendant',
        loadChildren: () =>
          import('@feature/dashboard/attendant/routes/attendant.routes').then(
            (m) => m.attendantDashboardRoutes
          ),
      },
      {
        path: 'dashboard/patient',
        canActivate: [profileExistsGuard],
        loadChildren: () =>
          import('@feature/dashboard/patient/routes/patient.routes').then(
            (m) => m.patientDashboardRoutes
          ),
      },


      {
        path: 'patient',
        loadChildren: () =>
          import('@feature/patient/patient-routes').then((m) => m.patientRoutes),
      },
      {
        path: 'subscription',
        loadChildren: () =>
          import('@feature/subscription/subscription-routes').then(
            (m) => m.subscriptionRoutes
          ),
      },
      {
        path: 'support',
        loadChildren: () =>
          import('@feature/support/support-routes').then(
            (m) => m.supportRoutes
          ),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('@feature/history/history-routes').then(
            (m) => m.historyRoutes
          ),
      },
      {
        path: 'vital-signs',
        loadChildren: () =>
          import('@feature/vital-signs/vital-signs-routes').then(
            (m) => m.vitalSignsRoutes
          ),
      },
    ],
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('@feature/auth/routes/auth.routes').then((m) => m.authRoutes),
  },

  {
    path: '403',
    loadComponent: () =>
      import('@shared/pages/forbidden/forbidden.component').then(
        (m) => m.ForbiddenPage
      ),
  },

  {
    path: '404',
    loadComponent: () =>
      import('@shared/pages/not-found/not-found.component').then(
        (m) => m.NotFoundPage
      ),
  },

  {
    path: 'onboarding',
    loadComponent: () =>
      import('@feature/onboarding/component/profile-onboarding.component').then(
        (m) => m.ProfileOnboardingComponent
      ),
  },

  {path: '**', redirectTo: 'dashboard'},
];
