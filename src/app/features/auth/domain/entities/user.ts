export type Role = 'ADMINISTRATOR' | 'ATTENDANT' | 'PATIENT';

export class User {
  constructor(public readonly id: string, public readonly username: string, public readonly roles: Role[], public readonly active = true) {
  }

  hasRole(r: Role) {
    return this.roles.includes(r);
  }
}
