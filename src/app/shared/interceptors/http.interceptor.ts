import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, EMPTY, Observable, retry } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  readonly baseUrl = "http://localhost:3000/"
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const clone = request.clone({
      url: `${this.baseUrl}${request.url}`,
    });

    return next.handle(clone)
    .pipe(retry(1), 
      catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
              errorMsg = `Error: ${error.error.message}`;
          } else {
              errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          console.log(errorMsg);
          return EMPTY;
      }) )}
    }



