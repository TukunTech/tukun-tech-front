import {Role} from '@feature/auth/domain/entities/user';
import {Allergy, BloodGroup, Gender, Nationality} from '@feature/auth/domain/entities/registration';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  password: string;
  role: Role;
  gender: Gender;
  age: number;
  bloodGroup: BloodGroup;
  nationality: Nationality;
  allergy: Allergy;
}
