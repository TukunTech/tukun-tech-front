import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {inject} from '@angular/core';
import {Session} from '@feature/auth/domain/entities/session';

export class RefreshSession {
  private repo = inject(AuthRepository);

  exec(refreshToken: string): Promise<Session> {
    return this.repo.refresh(refreshToken);
  }
}
