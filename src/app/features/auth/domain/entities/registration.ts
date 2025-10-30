export type Role = 'PATIENT' | 'ATTENDANT';

export class Registration {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role
  ) {}

  static fromForm(v: any): Registration {
    const role = v.role as Role | undefined;
    if (role !== 'PATIENT' && role !== 'ATTENDANT') {
      throw new Error('Registration.fromForm: role is required and must be PATIENT or ATTENDANT');
    }

    return new Registration(
      v.email ?? '',
      v.password ?? '',
      role
    );
  }
}
