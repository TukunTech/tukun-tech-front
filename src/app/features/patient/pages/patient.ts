import {Component, inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {
  PatientPersonalInfoComponent
} from '@feature/patient/components/patient/personal-info/patient-personal-info.component';
import {PatientStore, PatientPersonalInfo} from '@feature/patient/data/patient.store';

type AppRole = 'PATIENT' | 'ATTENDANT' | 'ADMINISTRATOR';

@Component({
  selector: 'app-patient',
  imports: [PatientPersonalInfoComponent, NgIf],
  templateUrl: './patient.html',
})
export class PatientComponent {
  private readonly auth = inject(AuthFacade);
  private readonly patientStore = inject(PatientStore);

  private readonly roles: AppRole[] = (this.auth.user()?.roles ?? []) as AppRole[];

  readonly isPatient: boolean = this.roles.includes('PATIENT');
  readonly isAttendant: boolean = this.roles.includes('ATTENDANT');
  readonly isAdmin: boolean = this.roles.includes('ADMINISTRATOR');

  get info(): PatientPersonalInfo | null {
    return this.patientStore.patient();
  }
}
