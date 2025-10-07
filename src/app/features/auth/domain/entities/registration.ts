export const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const;
export const BLOOD_GROUPS = [
  'O_POSITIVE', 'O_NEGATIVE',
  'A_POSITIVE', 'A_NEGATIVE',
  'B_POSITIVE', 'B_NEGATIVE',
  'AB_POSITIVE', 'AB_NEGATIVE',
] as const;
export const NATIONALITIES = [
  'PERUVIAN', 'COLOMBIAN', 'MEXICAN', 'CHILEAN', 'ARGENTINIAN',
  'VENEZUELAN', 'ECUADORIAN', 'BOLIVIAN', 'OTHER',
] as const;
export const ALLERGIES = [
  'PENICILLIN', 'ASPIRIN', 'LACTOSE', 'PEANUTS', 'SEAFOOD', 'GLUTEN', 'NONE', 'OTHER',
] as const;

export type Gender = typeof GENDERS[number];
export type BloodGroup = typeof BLOOD_GROUPS[number];
export type Nationality = typeof NATIONALITIES[number];
export type Allergy = typeof ALLERGIES[number];

export type Role = 'PATIENT' | 'ATTENDANT';

export class Registration {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dni: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role,
    public readonly gender: Gender,
    public readonly age: number,
    public readonly bloodGroup: BloodGroup,
    public readonly nationality: Nationality,
    public readonly allergy: Allergy,
  ) {
  }

  static fromForm(v: any): Registration {
    const norm = (x?: string) =>
      (x ?? '')
        .trim()
        .replaceAll('-', '_')
        .replaceAll(' ', '_')
        .toUpperCase();

    const firstName = (v?.firstName ?? v?.name ?? '').trim();
    const lastName = (v?.lastName ?? '').trim();
    const dni = (v?.dni ?? '').trim();
    const email = (v?.email ?? '').trim();
    const password = (v?.password ?? '').trim();
    const role = norm(v?.role) as Role;

    const gender = norm(v?.gender) as Gender;
    const bloodGroup = norm(v?.bloodGroup) as BloodGroup;
    const nationality = norm(v?.nationality) as Nationality;
    const allergy = norm(v?.allergy) as Allergy;

    const ageRaw = v?.age;
    const age = Number(ageRaw);

    if (!firstName) throw new Error('firstName requerido');
    if (!lastName) throw new Error('lastName requerido');
    if (!dni) throw new Error('dni requerido');
    if (!email) throw new Error('email requerido');
    if (!password) throw new Error('password requerido');
    if (!role) throw new Error('role requerido');

    if (!gender) throw new Error('gender requerido');
    if (!bloodGroup) throw new Error('bloodGroup requerido');
    if (!nationality) throw new Error('nationality requerido');
    if (!allergy) throw new Error('allergy requerido');

    if (!Number.isFinite(age)) throw new Error('age inválido');
    if (age < 0 || age > 130) throw new Error('age fuera de rango');

    return new Registration(
      firstName,
      lastName,
      dni,
      email,
      password,
      role,
      gender,
      age,
      bloodGroup,
      nationality,
      allergy,
    );
  }
}
