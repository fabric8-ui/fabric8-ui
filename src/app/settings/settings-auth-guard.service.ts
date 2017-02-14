import { AuthenticationService, Logger } from 'ngx-login-client';
import { ContextService } from './../shared/context.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class SettingsAuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private context: ContextService,
    private auth: AuthenticationService,
    private router: Router,
    private logger: Logger
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.logger.log('Please login to access ' + state.url);
      this.router.navigate(['/public']);
      return false;
    } else if (this.context.current.entity !== this.context.currentUser) {
      this.logger.log('You cannot access another users settings');
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
}

canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  return this.canActivate(route, state);
}
}
