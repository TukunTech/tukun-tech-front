import {Component, inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {NgIf} from '@angular/common';


type AppRole = 'PATIENT' | 'ATTENDANT' | 'ADMINISTRATOR';

@Component({
  selector: 'app-history',
  imports: [
    NgIf,

  ],
  templateUrl: '/history.html'
})

export class HistoryComponent {
  private auth = inject(AuthFacade);
  private readonly roles: AppRole[] = (this.auth.user()?.roles ?? []) as AppRole[];
  readonly isPatient: boolean = this.roles.includes('PATIENT');
  readonly isAttendant: boolean = this.roles.includes('ATTENDANT');
  readonly isAdmin: boolean = this.roles.includes('ADMINISTRATOR');
}
