import {
  ApplicationConfig,
} from '@angular/core';
import {provideRouter, withDebugTracing} from '@angular/router';
import {routes} from './app.routes';

import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';

import {apiErrorInterceptor} from '@core/interceptors/api-error';
import {apiPrefixInterceptor} from '@core/interceptors/api-prefix';
import {CustomTranslateLoader} from '@core/i18n/custom-translate-loader';
import {RefreshSession} from '@feature/auth/application/usecases/refresh-session';
import {LoginUser} from '@feature/auth/application/usecases/login-user';
import {HttpAuthRepository} from '@feature/auth/infrastructure/http/http-auth.repository';
import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {authTokenInterceptor} from '@core/interceptors/auth-token';

export function httpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http, '/assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing()),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      apiPrefixInterceptor,
      authTokenInterceptor,
      apiErrorInterceptor
    ])),
    {provide: AuthRepository, useClass: HttpAuthRepository},
    LoginUser,
    RefreshSession
  ],
};
