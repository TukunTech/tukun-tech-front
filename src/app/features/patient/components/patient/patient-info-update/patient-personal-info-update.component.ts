import {Component, computed, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatientPersonalInfo, PatientStore} from '@feature/patient/data/patient.store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-personal-info-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-personal-info-update.component.html',
  styleUrls: ['./patient-personal-info-update.component.css']
})
export class PatientPersonalInfoUpdateComponent {
  private readonly _data = signal<PatientPersonalInfo | null>(null);
  readonly form = signal<PatientPersonalInfo>({
    name: '',
    lastName: '',
    dni: '',
    age: '',
    sex: 'OTHER',
    bloodGroup: 'O_POSITIVE',
    nationality: 'OTHER',
    allergy: 'NONE'
  });

  private store = inject(PatientStore);
  private router = inject(Router);

  @Input('data')
  set setData(value: PatientPersonalInfo | null | undefined) {
    this._data.set(value ?? null);
    if (value) this.form.set({...value});
  }

  readonly data = this._data;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<PatientPersonalInfo>();

  ngOnInit() {
    const patient = this.store.patient();
    if (patient) {
      this.form.set({...patient});
      this._data.set(patient);
    } else {
      this.router.navigate(['/patient']);
    }
  }

  onCancel() {
    this.cancel.emit();
    this.router.navigate(['/patient']);
  }

  onSubmit() {
    const f = this.form();
    const age = typeof f.age === 'string' && f.age.trim() !== '' ? Number(f.age) : f.age;
    const updated = {...f, age};

    this.store.set(updated);

    this.submit.emit(updated);
    this.router.navigate(['/patient']);
  }

  readonly GENDERS = ['MALE', 'FEMALE', 'OTHER'];
  readonly BLOOD_GROUPS = [
    'O_POSITIVE', 'O_NEGATIVE', 'A_POSITIVE', 'A_NEGATIVE',
    'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'
  ];
  readonly NATIONALITIES = [
    'PERUVIAN', 'COLOMBIAN', 'MEXICAN', 'CHILEAN', 'ARGENTINIAN',
    'VENEZUELAN', 'ECUADORIAN', 'BOLIVIAN', 'OTHER'
  ];
  readonly ALLERGIES = [
    'PENICILLIN', 'ASPIRIN', 'LACTOSE', 'PEANUTS', 'SEAFOOD', 'GLUTEN', 'NONE', 'OTHER'
  ];

  update<K extends keyof PatientPersonalInfo>(key: K, value: PatientPersonalInfo[K]) {
    this.form.update(curr => ({...curr, [key]: value}));
  }

  pretty = (v: string) =>
    v.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase());

  readonly canSubmit = computed(() => {
    const f = this.form();
    return !!f.name && !!f.lastName && !!f.dni && String(f.dni).length >= 6 && !!f.age;
  });

  placeholders = Array.from({length: 8});
}
