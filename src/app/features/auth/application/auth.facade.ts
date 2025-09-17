import {computed, inject, Injectable, signal} from '@angular/core';
import {LoginUser} from '@feature/auth/application/usecases/login-user';
import {RefreshSession} from '@feature/auth/application/usecases/refresh-session';
import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {Session} from '@feature/auth/domain/entities/session';

@Injectable({providedIn: 'root'})
export class AuthFacade {
  private loginUC = inject(LoginUser);
  private refreshUC = inject(RefreshSession);
  private repo = inject(AuthRepository);

  private _session = signal<Session | null>(null);

  session = computed(() => this._session());
  user = computed(() => this._session()?.user ?? null);
  isAuthenticated = computed(() => !!this._session()?.accessToken);

  setSession(s: Session | null) {
    this._session.set(s);
  }

  async login(u: string, p: string) {
    const s = await this.loginUC.exec(u, p);
    this._session.set(s);
    return s;
  }

  async refresh(rt: string) {
    const s = await this.refreshUC.exec(rt);
    this._session.set(s);
    return s;
  }

  async logout() {
    await this.repo.logout();
    this._session.set(null);
  }
}
