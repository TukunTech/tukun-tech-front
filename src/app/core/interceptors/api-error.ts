import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error HTTP:', {
        url: req.url,
        status: error.status,
        message: error.message,
        error: error.error
      });

      return throwError(() => error);
    })
  );
};
