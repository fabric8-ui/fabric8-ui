import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authreq = req.clone(
      {
        setHeaders: {
          'Authorization' : `Bearer ${this.auth.getToken()}`,
          'Content-Type': `application/json`
        }
      }
    );
    return next.handle(authreq);
  }
}
