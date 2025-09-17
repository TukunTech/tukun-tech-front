import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl('/auth/login');
};
