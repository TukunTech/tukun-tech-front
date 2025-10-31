import {Component, computed, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {PatientPersonalInfo, PatientStore} from '@feature/patient/data/patient.store';
import {ProfileService, UpdateMyProfileRequest} from '@feature/onboarding/services/profile.service';
import {PatientProfile} from '@feature/onboarding/models/profile.model';
import {mapProfileToPersonalInfo} from '@feature/patient/data/patient-profile.mapper';

@Component({
  selector: 'app-patient-personal-info-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-personal-info-update.component.html',
  styleUrls: ['./patient-personal-info-update.component.css']
})
export class PatientPersonalInfoUpdateComponent {
  private readonly store = inject(PatientStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);

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

  @Input('data')
  set setData(value: PatientPersonalInfo | null | undefined) {
    this._data.set(value ?? null);
    if (value) this.form.set({...value});
  }

  readonly data = this._data;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<PatientPersonalInfo>();

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

  pretty = (v: string) => v.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
  readonly canSubmit = computed(() => {
    const f = this.form();
    return !!f.name && !!f.lastName && !!f.dni && String(f.dni).length >= 6 && f.age !== '';
  });
  placeholders = Array.from({length: 8});

  ngOnInit() {
    const preload = this.route.snapshot.data['preload'] as PatientProfile | null;

    if (preload) {
      this.form.set({
        name: preload.firstName ?? '',
        lastName: preload.lastName ?? '',
        dni: preload.dni ?? '',
        age: preload.age ?? '',
        sex: preload.gender ?? 'OTHER',
        bloodGroup: preload.bloodGroup ?? 'O_POSITIVE',
        nationality: preload.nationality ?? 'OTHER',
        allergy: preload.allergy ?? 'NONE',
      });

      this._data.set(this.form());
      return;
    }

    const fromStore = this.store.patient();
    if (fromStore) {
      this.form.set({...fromStore});
      this._data.set(fromStore);
      return;
    }

    this.router.navigate(['/patient']);
  }

  onCancel() {
    this.cancel.emit();
    this.router.navigate(['/patient']);
  }

  onSubmit() {
    if (!this.canSubmit()) return;

    const f = this.form();

    const age = typeof f.age === 'string' && f.age.trim() !== '' ? Number(f.age) : (f.age as number);

    const payload: UpdateMyProfileRequest = {
      firstName: f.name,
      lastName: f.lastName,
      dni: f.dni,
      age,
      gender: f.sex as string,
      bloodGroup: f.bloodGroup as string,
      nationality: f.nationality as string,
      allergy: f.allergy as string,
    };

    this.profileService.updateMyProfile(payload).subscribe({
      next: (updated) => {
        this.store.set(mapProfileToPersonalInfo(updated));

        this.submit.emit(this.form());
        this.router.navigate(['/patient']);
      },
      error: () => {
      }
    });
  }
}
