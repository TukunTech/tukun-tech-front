import { Component } from '@angular/core';

@Component({
  selector: 'app-patient-subscription',
  imports: [],
  templateUrl: './patient-subscription.html',
  styleUrl: './patient-subscription.css'
})
export class PatientSubscription {
  // Estos valores luego se reemplazan con el backend
  daysLeft = 10;
  currentPrice = 20;
  planName = 'Individual plan';
}
