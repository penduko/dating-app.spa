import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// global error handling
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        // check for HttpErrorResponse
        if (error instanceof HttpErrorResponse) {
          // check for application error
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            return throwError(applicationError);
          }

          // get error from the http response header error
          const serverError = error.error;
          let modelStateError = '';

          // check for server error and if typeof object
          // because thats what our model state returned of
          if (serverError && typeof serverError === 'object') {
            for (const key in serverError) {
              if (serverError[key]) {
                modelStateError += serverError[key] + '\n';
              }
            }
          }

          // pass the errors
          return throwError(modelStateError || serverError || 'Server errror');
        }
      })
    );
  }
}

// provider
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  // extend our http interceptor
  multi: true
};
