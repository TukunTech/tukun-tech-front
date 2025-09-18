import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

type AlertItem = { icon: string; label: string; time: string; level?: 'low' | 'mid' | 'high' };

@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard-patient.component.html',
  styleUrls: ['./dashboard-patient.component.css'],
})
export class DashboardPatientComponent {
  username = 'Welcome, let’s start';

  latestAlerts: AlertItem[] = [
    {icon: '/ic_warning_home.png', label: 'Low oxygenation', time: '10:10', level: 'high'},
    {icon: '/ic_warning_home.png', label: 'Accelerated heart rate', time: '15:20', level: 'mid'},
    {icon: '/ic_warning_home.png', label: 'Low heart rate', time: '20:30', level: 'low'}
  ];

  reminder = {
    title: 'REMINDER',
    body: 'Your plan expires in:',
    days: 10
  };

  faqs = [
    {
      q: 'What vital signs does TukunTech measure?',
      a: `It currently measures heart rate, oxygen saturation (SpO₂), and body temperature. These parameters are key to the prevention and early detection of cardiovascular and respiratory problems.`
    },
    {
      q: 'Is it necessary to have an internet connection to use the system?',
      a: `Yes, TukunTech relies on internet connectivity to send device data to the cloud so it can be viewed in real time on the web or mobile app.`
    },
    {
      q: 'Who can access patient information?',
      a: `In the Individual Plan, only the primary user can access the patient's data.
In the Family Plan, up to three family members or caregivers can simultaneously access the patient's data from the app.`
    },
    {
      q: 'What do I do if I receive a red alert?',
      a: `You must follow the protocol prescribed by your primary care physician and, if an emergency is confirmed, immediately contact health services. The system simulates this process with a red LED and critical notifications to train and prepare the user.`
    }
  ];
}
