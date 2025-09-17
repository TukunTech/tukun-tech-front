import {User} from '@feature/auth/domain/entities/user';

export class Session {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: User,
    public readonly tokenType = 'Bearer',
    public readonly expiresIn?: number
  ) {
  }
}
