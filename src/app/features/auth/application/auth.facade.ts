import {computed, inject, Injectable, signal} from '@angular/core';
import {LoginUser} from '@feature/auth/application/usecases/login-user';
import {RefreshSession} from '@feature/auth/application/usecases/refresh-session';
import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {Session} from '@feature/auth/domain/entities/session';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private loginUC = inject(LoginUser);
  private refreshUC = inject(RefreshSession);
  private repo = inject(AuthRepository);

  private static ACCESS_KEY = 'tt_access_token';
  private static REFRESH_KEY = 'tt_refresh_token';
  private static USER_KEY   = 'tt_user';

  private _session = signal<Session | null>(null);

  session = computed(() => this._session());
  user = computed(() => this._session()?.user ?? null);
  isAuthenticated = computed(() => !!this._session()?.accessToken);

  setSession(s: Session | null) {
    this._session.set(s);
  }

  async login(u: string, p: string) {
    const s = await this.loginUC.exec(u, p); // debe devolver { accessToken, refreshToken?, user }
    this._session.set(s);
    this.saveToStorage(s);
    return s;
  }

  async refresh(rt: string) {
    const s = await this.refreshUC.exec(rt);
    this._session.set(s);
    this.saveToStorage(s);
    return s;
  }

  async logout() {
    await this.repo.logout();
    this._session.set(null);
    this.clearStorage();
  }

  initFromStorage() {
    if (typeof window === 'undefined') return; // por si SSR
    try {
      const accessToken = localStorage.getItem(AuthFacade.ACCESS_KEY) ?? undefined;
      const refreshToken = localStorage.getItem(AuthFacade.REFRESH_KEY) ?? undefined;
      const userRaw = localStorage.getItem(AuthFacade.USER_KEY);

      if (!accessToken || !userRaw) return;

      const user = JSON.parse(userRaw);
      const session: Session = { accessToken, refreshToken, user } as Session;
      this._session.set(session);
    } catch {
      this.clearStorage();
      this._session.set(null);
    }
  }

  private saveToStorage(s: Session) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AuthFacade.ACCESS_KEY, s.accessToken);
    if ((s as any).refreshToken) {
      localStorage.setItem(AuthFacade.REFRESH_KEY, (s as any).refreshToken);
    }
    localStorage.setItem(AuthFacade.USER_KEY, JSON.stringify(s.user));
  }

  private clearStorage() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AuthFacade.ACCESS_KEY);
    localStorage.removeItem(AuthFacade.REFRESH_KEY);
    localStorage.removeItem(AuthFacade.USER_KEY);
  }
}
