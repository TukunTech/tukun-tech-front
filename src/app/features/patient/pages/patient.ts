import {Component, inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {
  PatientPersonalInfo,
  PatientPersonalInfoComponent
} from '@feature/patient/components/patient/personal-info/patient-personal-info.component';
import {NgIf} from '@angular/common';

type AppRole = 'PATIENT' | 'ATTENDANT' | 'ADMINISTRATOR';

@Component({
  selector: 'app-patient',
  imports: [
    PatientPersonalInfoComponent,
    NgIf
  ],
  templateUrl: './patient.html',
})
export class PatientComponent {
  private auth = inject(AuthFacade);

  private readonly roles: AppRole[] = (this.auth.user()?.roles ?? []) as AppRole[];

  readonly isPatient: boolean = this.roles.includes('PATIENT');
  readonly isAttendant: boolean = this.roles.includes('ATTENDANT');
  readonly isAdmin: boolean = this.roles.includes('ADMINISTRATOR');

  readonly info: PatientPersonalInfo = {
    name: 'Rocco',
    lastName: 'Rodríguez',
    dni: '74854932',
    age: 32,
    sex: 'Male',
    bloodGroup: 'A+',
    nationality: 'Brazilian',
    allergy: 'Penicillin'
  };
}
