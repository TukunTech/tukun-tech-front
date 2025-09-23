import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';

interface HistoryRecord {
  date: string;
  message: string;
  hr_bpm: number;
  spo2: number;
  temperature: number;
  type: 'green' | 'blue' | 'red' | 'gray';
}

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [NgClass, NgForOf, NgIf],
  templateUrl: './patient-history.html',
  styleUrls: ['./patient-history.css'],
})
export class PatientHistoryComponent implements OnInit, OnDestroy {
  historyRecords: HistoryRecord[] = [];
  private intervalId: any;

  ngOnInit(): void {
    // Simulación inicial de registros
    this.historyRecords = [
      {
        date: 'Monday 10:23',
        message: 'Pulse slightly elevated. Stay calm.',
        hr_bpm: 103,
        spo2: 95,
        temperature: 36.8,
        type: 'green',
      },
      {
        date: 'Saturday 17:03',
        message: 'Moderate alert. Consider taking preventive action.',
        hr_bpm: 120,
        spo2: 93,
        temperature: 38.0,
        type: 'blue',
      },
      {
        date: 'Monday 12:00',
        message: 'All values within normal range.',
        hr_bpm: 80,
        spo2: 97,
        temperature: 36.5,
        type: 'gray',
      },
      {
        date: 'Friday 15:47',
        message: 'Critical alert! Oxygen saturation or pulse at dangerous levels.',
        hr_bpm: 140,
        spo2: 82,
        temperature: 39,
        type: 'red',
      },
    ];

    // Simulación automática cada 5 segundos
    this.intervalId = setInterval(() => {
      this.generateRecord();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Generador de registros
  generateRecord(): void {
    const now = new Date();

    const hr_bpm = Math.floor(Math.random() * (140 - 55) + 55); // 55 - 140
    const spo2 = Math.floor(Math.random() * (99 - 80) + 80);    // 80 - 99
    const temperature = Math.floor(Math.random() * (39 - 36) + 36); // 36 - 39

    // Determinar tipo de alerta
    let type: 'green' | 'blue' | 'red' | 'gray' = 'gray';
    let message = 'All values within normal range.';

    if ((hr_bpm > 100 && hr_bpm <= 110) || (temperature >= 37.5 && temperature < 38)) {
      type = 'green';
      message = 'Pulse slightly elevated. Stay calm.';
    } else if ((hr_bpm > 110 && hr_bpm <= 125) || (temperature >= 38 && temperature < 39)) {
      type = 'blue';
      message = 'Moderate alert. Consider taking preventive action.';
    } else if (hr_bpm < 60 || hr_bpm > 125 || spo2 < 90) {
      type = 'red';
      message = 'Critical alert! Oxygen saturation or pulse at dangerous levels.';
    }

    const record: HistoryRecord = {
      date: now.toLocaleString(),
      message,
      hr_bpm,
      spo2,
      temperature,
      type,
    };

    this.addRecord(record);
  }

  // Agregar un registro con límite de 10
  addRecord(record: HistoryRecord): void {
    if (this.historyRecords.length >= 10) {
      this.historyRecords.shift();
    }
    this.historyRecords.push(record);
  }
}
