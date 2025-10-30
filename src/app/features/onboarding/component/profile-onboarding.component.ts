import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '@feature/onboarding/services/profile.service';
import {
  ALLERGY_OPTIONS, BLOOD_GROUP_OPTIONS, NATIONALITY_OPTIONS, GENDER_OPTIONS,
  Allergy, BloodGroup, Nationality, Gender, PatientProfile
} from '@feature/onboarding/models/profile.model';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-profile-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-onboarding.component.html',
  styleUrls: ['./profile-onboarding.component.css'],
})
export class ProfileOnboardingComponent implements OnInit {
  bloodGroups = BLOOD_GROUP_OPTIONS;
  nationalities = NATIONALITY_OPTIONS;
  genders = GENDER_OPTIONS;
  allergies = ALLERGY_OPTIONS;

  saving = false;
  redirect!: string;

  form!: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    dni: FormControl<string>;
    age: FormControl<number>;
    gender: FormControl<Gender | ''>;
    bloodGroup: FormControl<BloodGroup | ''>;
    nationality: FormControl<Nationality | ''>;
    allergy: FormControl<Allergy | ''>;
  }>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profile: ProfileService
  ) {
  }

  ngOnInit(): void {
    this.redirect = this.route.snapshot.queryParamMap.get('redirect') || '/dashboard/patient';

    this.form = this.fb.group({
      firstName: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
      lastName: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
      dni: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{8}$/)], // 8 dígitos exactos
      }),
      age: this.fb.control(18, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1), Validators.max(120)],
      }),
      gender: this.fb.control<Gender | ''>('', {nonNullable: true, validators: [Validators.required]}),
      bloodGroup: this.fb.control<BloodGroup | ''>('', {nonNullable: true, validators: [Validators.required]}),
      nationality: this.fb.control<Nationality | ''>('', {nonNullable: true, validators: [Validators.required]}),
      allergy: this.fb.control<Allergy | ''>('', {nonNullable: true, validators: [Validators.required]}),
    });
  }

  submit() {
    if (this.saving) return;
    if (this.form.invalid) return;

    this.saving = true;

    const raw = this.form.getRawValue();

    const dniSan = raw.dni.replace(/\D/g, '');
    if (!/^\d{8}$/.test(dniSan)) {
      this.form.get('dni')?.setErrors({pattern: true});
      this.saving = false;
      return;
    }

    const payload: Omit<PatientProfile, 'id' | 'userId'> = {
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      dni: dniSan,
      age: Number(raw.age),
      gender: raw.gender as Gender,
      bloodGroup: raw.bloodGroup as BloodGroup,
      nationality: raw.nationality as Nationality,
      allergy: raw.allergy as Allergy,
    };

    this.profile.createProfile(payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          this.router.navigateByUrl(this.redirect, {replaceUrl: true});
        },
        error: (e) => {
          const msg = e?.error?.message || e?.message || 'Error creando perfil';
          console.error('Error creando perfil', e?.error ?? e);
          alert(msg);
        },
      });
  }
}
