import {Session} from '@feature/auth/domain/entities/session';

export abstract class AuthRepository {
  abstract login(username: string, password: string): Promise<Session>;

  abstract refresh(refreshToken: string): Promise<Session>;

  abstract logout(): Promise<void>;
}
