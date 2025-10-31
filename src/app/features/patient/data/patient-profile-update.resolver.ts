import {Injectable} from '@angular/core';
import {Resolve, Router} from '@angular/router';
import {PatientProfile} from '@feature/onboarding/models/profile.model';
import {ProfileService} from '@feature/onboarding/services/profile.service';
import {catchError, map, Observable, of, take} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PatientProfileUpdateResolver implements Resolve<PatientProfile | null> {
  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
  ) {
  }

  resolve(): Observable<PatientProfile | null> {
    return this.profileService.getMyProfile().pipe(
      take(1),
      map(profile => {
        if (!profile) {
          this.router.navigate(['/onboarding'], {queryParams: {redirect: '/patient/update'}});
          return null;
        }
        return profile;
      }),
      catchError(() => {
        this.router.navigate(['/onboarding'], {queryParams: {redirect: '/patient/update'}});
        return of(null);
      })
    );
  }
}
