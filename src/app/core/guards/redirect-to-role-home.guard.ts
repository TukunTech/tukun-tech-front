import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';

export const redirectToRoleHomeGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  const roles = auth.user()?.roles ?? [];
  let url = '/auth/login';
  if (roles.includes('ADMINISTRATOR')) url = '/dashboard/admin';
  else if (roles.includes('ATTENDANT')) url = '/dashboard/attendant';
  else if (roles.includes('PATIENT')) url = '/dashboard/patient';

  return router.parseUrl(url) as UrlTree;
};
