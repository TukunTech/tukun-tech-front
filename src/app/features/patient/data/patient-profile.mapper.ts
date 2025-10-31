import {
  ALLERGY_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  PatientProfile
} from '@feature/onboarding/models/profile.model';
import {PatientPersonalInfo} from '@feature/patient/data/patient.store';

type Option = { value: string; label: string };

function labelFrom(options: Option[], value?: string | null, fallback: string = '—'): string {
  if (!value) return fallback;
  const found = options.find(o => o.value === value);
  return found?.label ?? value ?? fallback;
}

export function mapProfileToPersonalInfo(profile: PatientProfile): PatientPersonalInfo {
  return {
    name: profile.firstName ?? '—',
    lastName: profile.lastName ?? '—',
    dni: profile.dni ?? '—',
    age: profile.age ?? '—',
    sex: labelFrom(GENDER_OPTIONS as Option[], profile.gender),
    bloodGroup: labelFrom(BLOOD_GROUP_OPTIONS as Option[], profile.bloodGroup),
    nationality: labelFrom(NATIONALITY_OPTIONS as Option[], profile.nationality),
    allergy: labelFrom(ALLERGY_OPTIONS as Option[], profile.allergy),
  };
}
