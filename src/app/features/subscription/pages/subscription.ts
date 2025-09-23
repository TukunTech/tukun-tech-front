import {Component, inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {NgIf} from '@angular/common';
import {PatientSubscription} from '@feature/subscription/components/patient/patient-subscription/patient-subscription';
type AppRole = 'PATIENT' | 'ATTENDANT' | 'ADMINISTRATOR';

@Component({
  selector: 'app-subscription',
  imports: [
    NgIf,
    PatientSubscription
  ],
  templateUrl: './subscription.html',
})
export class SubscriptionComponent {
  private auth = inject(AuthFacade);

  private readonly roles: AppRole[] = (this.auth.user()?.roles ?? []) as AppRole[];

  readonly isPatient: boolean = this.roles.includes('PATIENT');
  readonly isAttendant: boolean = this.roles.includes('ATTENDANT');
  readonly isAdmin: boolean = this.roles.includes('ADMINISTRATOR');
}
