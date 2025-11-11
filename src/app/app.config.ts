import {
  APP_INITIALIZER,
  ApplicationConfig,
  ApplicationRef,
} from '@angular/core';
import {provideRouter, withDebugTracing, Router} from '@angular/router';
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
import {provideRouterUx} from '@core/metrics/router-ux';
import {initUxMetrics} from '@core/metrics/ux-metrics';

function initAuthFactory(auth: AuthFacade) {
  return () => auth.initFromStorage();
}


function initUxFactory(appRef: ApplicationRef, router: Router) {
  return () => {
    try {
      initUxMetrics(appRef, router);
    } catch (e) {
      console.warn('[UX] init error', e);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing()),
    provideRouterUx(),
    provideHttpClient(withInterceptors([
      apiPrefixInterceptor,
      authTokenInterceptor,
      apiErrorInterceptor
    ])),
    {provide: AuthRepository, useClass: HttpAuthRepository},
    LoginUser,
    RefreshSession,

    {
      provide: APP_INITIALIZER,
      useFactory: initAuthFactory,
      deps: [AuthFacade],
      multi: true,
    },

    {
      provide: APP_INITIALIZER,
      useFactory: initUxFactory,
      deps: [ApplicationRef, Router],
      multi: true,
    },
  ],
};
