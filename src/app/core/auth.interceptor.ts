import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  const forwarded = token
    ? next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
    : next(request);

  return forwarded.pipe(
    catchError((error: HttpErrorResponse) => {
      // A token was sent but rejected (expired / invalid) → the session is no
      // longer valid, so sign out and send the user back to login instead of
      // leaving the app stuck with silently failing requests.
      if (token && !request.url.includes('/auth/') && (error.status === 401 || error.status === 403)) {
        auth.signOut();
      }
      return throwError(() => error);
    })
  );
};
