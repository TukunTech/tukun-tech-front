export type Allergy =
  | 'PENICILLIN' | 'ASPIRIN' | 'LACTOSE' | 'PEANUTS' | 'SEAFOOD' | 'GLUTEN' | 'NONE' | 'OTHER';

export type BloodGroup =
  | 'O_POSITIVE' | 'O_NEGATIVE'
  | 'A_POSITIVE' | 'A_NEGATIVE'
  | 'B_POSITIVE' | 'B_NEGATIVE'
  | 'AB_POSITIVE' | 'AB_NEGATIVE';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type Nationality =
  | 'PERUVIAN' | 'COLOMBIAN' | 'MEXICAN' | 'CHILEAN' | 'ARGENTINIAN'
  | 'VENEZUELAN' | 'ECUADORIAN' | 'BOLIVIAN' | 'OTHER';

export interface PatientProfile {
  id?: number;
  userId?: string;
  firstName: string;
  lastName: string;
  dni: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  nationality: Nationality;
  allergy: Allergy;
}


export const BLOOD_GROUP_OPTIONS: { value: BloodGroup; label: string }[] = [
  {value: 'O_POSITIVE', label: 'O Positive (O+)'},
  {value: 'O_NEGATIVE', label: 'O Negative (O-)'},
  {value: 'A_POSITIVE', label: 'A Positive (A+)'},
  {value: 'A_NEGATIVE', label: 'A Negative (A-)'},
  {value: 'B_POSITIVE', label: 'B Positive (B+)'},
  {value: 'B_NEGATIVE', label: 'B Negative (B-)'},
  {value: 'AB_POSITIVE', label: 'AB Positive (AB+)'},
  {value: 'AB_NEGATIVE', label: 'AB Negative (AB-)'},
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
  {value: 'OTHER', label: 'Other'},
];

export const NATIONALITY_OPTIONS: { value: Nationality; label: string }[] = [
  {value: 'PERUVIAN', label: 'Peruvian'},
  {value: 'COLOMBIAN', label: 'Colombian'},
  {value: 'MEXICAN', label: 'Mexican'},
  {value: 'CHILEAN', label: 'Chilean'},
  {value: 'ARGENTINIAN', label: 'Argentinian'},
  {value: 'VENEZUELAN', label: 'Venezuelan'},
  {value: 'ECUADORIAN', label: 'Ecuadorian'},
  {value: 'BOLIVIAN', label: 'Bolivian'},
  {value: 'OTHER', label: 'Other'},
];

export const ALLERGY_OPTIONS: { value: Allergy; label: string }[] = [
  {value: 'PENICILLIN', label: 'Penicillin'},
  {value: 'ASPIRIN', label: 'Aspirin'},
  {value: 'LACTOSE', label: 'Lactose'},
  {value: 'PEANUTS', label: 'Peanuts'},
  {value: 'SEAFOOD', label: 'Seafood'},
  {value: 'GLUTEN', label: 'Gluten'},
  {value: 'NONE', label: 'None'},
  {value: 'OTHER', label: 'Other'},
];
