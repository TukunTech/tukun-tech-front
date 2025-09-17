import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {inject} from '@angular/core';
import {Session} from '@feature/auth/domain/entities/session';

export class LoginUser {
  private repo = inject(AuthRepository);

  exec(username: string, password: string): Promise<Session> {
    return this.repo.login(username, password);
  }
}
