import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  ErrorHandler
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { apiErrorInterceptor } from './core/interceptors/api-error';
import { apiPrefixInterceptor } from './core/interceptors/api-prefix';
import { CustomTranslateLoader } from './core/i18n/custom-translate-loader';

export function httpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http, '/assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),

    provideHttpClient(withInterceptors([apiPrefixInterceptor, apiErrorInterceptor])),

    provideAnimationsAsync(),

    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
