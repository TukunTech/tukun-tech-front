import {Component, inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {NgIf} from '@angular/common';
import {VitalSignsPatientComponent} from '@feature/vital-signs/components/patient/vital-signs-patient.component';
type AppRole = 'PATIENT' | 'ATTENDANT' | 'ADMINISTRATOR';

@Component({
  selector: 'app-vital-signs',
  imports: [
    NgIf,
    VitalSignsPatientComponent
  ],
  templateUrl: '/vital-signs.html',
})
export class VitalSignsComponent {
  private auth = inject(AuthFacade);

  private readonly roles: AppRole[] = (this.auth.user()?.roles ?? []) as AppRole[];

  readonly isPatient: boolean = this.roles.includes('PATIENT');
  readonly isAttendant: boolean = this.roles.includes('ATTENDANT');
  readonly isAdmin: boolean = this.roles.includes('ADMINISTRATOR');

}
