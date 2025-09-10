import {environment} from '../../../environments/environment';
import {HttpInterceptorFn} from '@angular/common/http';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (!/^https?:\/\//i.test(req.url)) {
    req = req.clone({ url: `${environment.apiUrl}${req.url}` });
  }
  return next(req);
};
