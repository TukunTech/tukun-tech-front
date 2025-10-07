import {Session} from '@feature/auth/domain/entities/session';
import {Registration} from '@feature/auth/domain/entities/registration';

export abstract class AuthRepository {
  abstract login(username: string, password: string): Promise<Session>;

  abstract refresh(refreshToken: string): Promise<Session>;

  abstract logout(): Promise<void>;

  abstract register(data: Registration): Promise<Session>;

}
