import {
  APP_INITIALIZER,
  ApplicationConfig,
} from '@angular/core';
import {provideRouter, withDebugTracing} from '@angular/router';
import {routes} from './app.routes';

import {provideHttpClient, withInterceptors} from '@angular/common/http';

import {apiErrorInterceptor} from '@core/interceptors/api-error';
import {apiPrefixInterceptor} from '@core/interceptors/api-prefix';
import {RefreshSession} from '@feature/auth/application/usecases/refresh-session';
import {LoginUser} from '@feature/auth/application/usecases/login-user';
import {HttpAuthRepository} from '@feature/auth/infrastructure/http/http-auth.repository';
import {AuthRepository} from '@feature/auth/domain/auth.repository';
import {authTokenInterceptor} from '@core/interceptors/auth-token';
import {AuthFacade} from '@feature/auth/application/auth.facade';

function initAuthFactory(auth: AuthFacade) {
  return () => auth.initFromStorage();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing()),
    provideHttpClient(withInterceptors([
      apiPrefixInterceptor,
      authTokenInterceptor,
      apiErrorInterceptor
    ])),
    { provide: AuthRepository, useClass: HttpAuthRepository },
    LoginUser,
    RefreshSession,
    {
      provide: APP_INITIALIZER,
      useFactory: initAuthFactory,
      deps: [AuthFacade],
      multi: true,
    },
  ],
};
