import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {Role} from '@feature/auth/domain/entities/user';

export const roleGuard = (required: Role[]): CanActivateFn => (): boolean | UrlTree => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  const roles = new Set<Role>(auth.user()?.roles ?? []);
  return required.some(r => roles.has(r)) ? true : router.parseUrl('/403');
};
