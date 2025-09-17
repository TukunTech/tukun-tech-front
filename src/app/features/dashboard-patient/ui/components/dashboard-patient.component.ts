import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard-patient.component.html',
  styleUrls: ['./dashboard-patient.component.css'],
})
export class DashboardPatientComponent {
}
