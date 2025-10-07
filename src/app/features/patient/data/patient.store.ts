import {Injectable, signal} from '@angular/core';

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

@Injectable({providedIn: 'root'})
export class PatientStore {
  private readonly _patient = signal<PatientPersonalInfo | null>(null);

  patient = this._patient;

  set(data: PatientPersonalInfo | null) {
    this._patient.set(data);
  }

  patch(partial: Partial<PatientPersonalInfo>) {
    const current = this._patient();
    if (current) {
      this._patient.set({...current, ...partial});
    }
  }

  clear() {
    this._patient.set(null);
  }
}
