import {Component, inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {NgIf} from '@angular/common';
import {PatientSubscription} from '@feature/subscription/components/patient/patient-subscription/patient-subscription';
import {SupportPatient} from '@feature/support/components/patient/support-patient/support-patient';
type AppRole = 'PATIENT' | 'ATTENDANT' | 'ADMINISTRATOR';

@Component({
  selector: 'app-support',
  imports: [
    NgIf,
    PatientSubscription,
    SupportPatient
  ],
  templateUrl: '/support.html',
})
export class SupportComponent {
  private auth = inject(AuthFacade);

  private readonly roles: AppRole[] = (this.auth.user()?.roles ?? []) as AppRole[];

  readonly isPatient: boolean = this.roles.includes('PATIENT');
  readonly isAttendant: boolean = this.roles.includes('ATTENDANT');
  readonly isAdmin: boolean = this.roles.includes('ADMINISTRATOR');
}
