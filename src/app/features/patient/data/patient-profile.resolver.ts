import {Injectable} from '@angular/core';
import {Resolve, Router} from '@angular/router';
import {ProfileService} from '@feature/onboarding/services/profile.service';
import {PatientStore} from '@feature/patient/data/patient.store';
import {catchError, map, Observable, of, take} from 'rxjs';
import {mapProfileToPersonalInfo} from '@feature/patient/data/patient-profile.mapper';

@Injectable({providedIn: 'root'})
export class PatientProfileResolver implements Resolve<boolean> {
  constructor(
    private readonly profileService: ProfileService,
    private readonly patientStore: PatientStore,
    private readonly router: Router
  ) {
  }

  resolve(): Observable<boolean> {
    return this.profileService.getMyProfile().pipe(
      take(1),
      map(profile => {
        if (!profile) {
          this.router.navigate(['/onboarding'], {queryParams: {redirect: '/patient'}});
          return false;
        }
        const ui = mapProfileToPersonalInfo(profile);
        this.patientStore.set(ui);
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/onboarding'], {queryParams: {redirect: '/patient'}});
        return of(false);
      })
    );
  }
}
