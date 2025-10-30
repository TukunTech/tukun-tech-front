export type RegisterRequest = {
  email: string;
  password: string;
  role: 'ATTENDANT' | 'PATIENT';
};
