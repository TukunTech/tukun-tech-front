import {environment} from '@env/environment';
import {HttpContextToken, HttpInterceptorFn} from '@angular/common/http';

export const TARGET_API = new HttpContextToken<string>(() => environment.apiUrl);

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const base = req.context.get(TARGET_API) || environment.apiUrl;
  const isAbsolute = /^https?:\/\//i.test(req.url);
  return next(isAbsolute ? req : req.clone({url: base.replace(/\/+$/, '') + req.url}));

};
