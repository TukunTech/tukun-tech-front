export interface PatientPersonalInfo {
  name: string;
  lastName: string;
  dni: string;
  age: number | string;
  sex: 'Male' | 'Female' | 'Other' | string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | string;
  nationality: string;
  allergy: string;
}
