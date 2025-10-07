import {Component, effect, inject, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {PatientStore} from '@feature/patient/data/patient.store';

export interface PatientPersonalInfo {
  name: string;
  lastName: string;
  dni: string;
  age: number | string;
  sex: string;
  bloodGroup: string;
  nationality: string;
  allergy: string;
}

@Component({
  selector: 'app-patient-personal-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-personal-info.component.html',
  styleUrls: ['./patient-personal-info.component.css']
})
export class PatientPersonalInfoComponent {
  private readonly _data = signal<PatientPersonalInfo | null>(null);
  readonly data = this._data;

  private router = inject(Router);
  private store = inject(PatientStore);

  @Input('data')
  set setData(value: PatientPersonalInfo | null | undefined) {
    this._data.set(value ?? null);
  }

  placeholders = Array.from({length: 8});

  constructor() {
    effect(() => {
      const storeData = this.store.patient();
      if (storeData) this._data.set(storeData);
    });
  }

  goToUpdate() {
    const current = this.data();
    if (!current) return;
    this.store.set(current);
    this.router.navigate(['/patient/update']);
  }
}
