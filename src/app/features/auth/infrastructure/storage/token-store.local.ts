import {Injectable} from '@angular/core';
import {environment} from '@env/environment';

@Injectable({providedIn: 'root'})
export class LocalTokenStore {
  getAccess() {
    return localStorage.getItem(environment.authTokenKey);
  }

  getRefresh() {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  setTokens(a: string, r: string) {
    localStorage.setItem(environment.authTokenKey, a);
    localStorage.setItem(environment.refreshTokenKey, r);
  }

  clear() {
    localStorage.removeItem(environment.authTokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
  }
}
