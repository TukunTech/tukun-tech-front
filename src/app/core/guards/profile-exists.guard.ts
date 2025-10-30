import {inject} from '@angular/core';
import {
  CanActivateFn,
  Router,
} from '@angular/router';
import {ProfileService} from '@feature/onboarding/services/profile.service';
import {catchError, map, Observable, of} from 'rxjs';

export const profileExistsGuard: CanActivateFn = () => {
  const router = inject(Router);
  const profileService = inject(ProfileService);

  return profileService.getMyProfile().pipe(
    map(profile => {
      if (profile) return true;
      return router.createUrlTree(['/onboarding'], {
        queryParams: {redirect: '/dashboard'},
      });
    }),
    catchError(() =>
      of(router.createUrlTree(['/onboarding'], {queryParams: {redirect: '/dashboard'}}))
    )
  );
};
