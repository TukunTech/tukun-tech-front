import {BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {LocalTokenStore} from '@feature/auth/infrastructure/storage/token-store.local';
import {environment} from '@env/environment';

let isRefreshing = false;
const token$ = new BehaviorSubject<string | null>(null);

export const authTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const store = inject(LocalTokenStore);
  const facade = inject(AuthFacade);

  const at = store.getAccess();

  const isAbsolute = /^https?:\/\//i.test(req.url);
  const isApiUrl =
    (!isAbsolute && (req.url.startsWith('/api/') || req.url.includes('/api/v1/'))) ||
    (isAbsolute && (req.url.startsWith(environment.apiUrl) || req.url.includes('/api/v1/')));

  if (at && isApiUrl && !req.headers.has('Authorization')) {
    req = req.clone({setHeaders: {Authorization: `Bearer ${at}`}});
  }

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) return throwError(() => err);

      const rt = store.getRefresh();
      if (!rt) {
        store.clear();
        facade.setSession(null);
        return throwError(() => err);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        token$.next(null);
        return new Observable<HttpEvent<unknown>>((sub) => {
          facade.refresh(rt).then(s => {
            store.setTokens(s.accessToken, s.refreshToken);
            token$.next(s.accessToken);

            const retried = req.clone({setHeaders: {Authorization: `Bearer ${s.accessToken}`}});
            next(retried).subscribe(sub);
          }).catch(e => {
            store.clear();
            facade.setSession(null);
            sub.error(e);
          }).finally(() => {
            isRefreshing = false;
          });
        });
      }

      return token$.pipe(
        filter((t): t is string => t !== null),
        take(1),
        switchMap(t => {
          const retried = req.clone({setHeaders: {Authorization: `Bearer ${t}`}});
          return next(retried);
        })
      );
    }),
    finalize(() => {
    })
  );
};
