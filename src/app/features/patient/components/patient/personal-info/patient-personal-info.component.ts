import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

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

  @Input('data')
  set setData(value: PatientPersonalInfo | null | undefined) {
    this._data.set(value ?? null);
  }

  @Output() requestUpdate = new EventEmitter<void>();
  onRequestUpdate() { this.requestUpdate.emit(); }

  readonly data = this._data;

  placeholders = Array.from({ length: 8 });
}
