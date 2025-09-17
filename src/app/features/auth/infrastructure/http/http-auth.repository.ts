import {inject, Injectable} from '@angular/core';
import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {HttpClient} from '@angular/common/http';
import {LocalTokenStore} from '@feature/auth/infrastructure/storage/token-store.local';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {Session} from '@feature/auth/domain/entities/session';
import {AUTH_API} from '@feature/auth/infrastructure/http/auth.api';
import {toSession} from '@feature/auth/infrastructure/mappers/auth.mapper';

@Injectable()
export class HttpAuthRepository extends AuthRepository {
  private http = inject(HttpClient);
  private store = inject(LocalTokenStore);

  override async login(username: string, password: string): Promise<Session> {
    const body = {email: username, password};
    const dto = await this.http.post<any>(AUTH_API.LOGIN, body).toPromise();
    const s = toSession(dto);
    this.store.setTokens(s.accessToken, s.refreshToken);
    return s;
  }


  override async refresh(refreshToken: string): Promise<Session> {
    const dto = await this.http.post<any>(AUTH_API.REFRESH, {refreshToken}).toPromise();
    const s = toSession(dto);
    this.store.setTokens(s.accessToken, s.refreshToken);
    return s;
  }

  override async logout(): Promise<void> {
    try {
      await this.http.post(AUTH_API.LOGOUT, {}).toPromise();
    } finally {
      this.store.clear();
    }
  }
}
