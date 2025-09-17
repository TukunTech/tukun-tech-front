import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';

export const activeAccountGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  const u = auth.user(); // <- invoca
  return u && u.active !== false ? true : router.parseUrl('/auth/login');
};
