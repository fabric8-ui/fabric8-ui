import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthenticationService, Logger } from 'ngx-login-client';
import { LoginService } from './login.service';


// Basic guard that checks the user is logged in

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected auth: AuthenticationService,
    protected router: Router,
    protected logger: Logger,
    protected login: LoginService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.auth.isLoggedIn()) {
      this.logger.log('Please login to access ' + state.url);
      this.login.redirectUrl = state.url;
      this.logger.log('Setting redirect URL to ' + this.login.redirectUrl);
      this.router.navigate(['/public']);
      return Observable.of(false);
    } else {
      return Observable.of(true);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
