import {inject, Injectable} from '@angular/core';
import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {Registration} from '@feature/auth/domain/entities/registration';
import {Session} from '@feature/auth/domain/entities/session';
@Injectable({providedIn: 'root'})
export class RegisterUser {
  private readonly repo = inject(AuthRepository);

  exec(data: Registration): Promise<Session> {
    return this.repo.register(data);
  }
}
