import { Context, Contexts } from 'ngx-fabric8-wit';
import { DummyService } from './dummy.service';
import { LoginService } from './login.service';
import { AuthGuard } from './../shared/auth-guard.service';
import { AuthenticationService, Logger } from 'ngx-login-client';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class ContextCurrentUserAuthGuard
  extends AuthGuard
  implements CanActivate, CanActivateChild {

    private _context: Context;

  constructor(
    context: Contexts,
    auth: AuthenticationService,
    router: Router,
    logger: Logger,
    login: LoginService,
    private dummy: DummyService
  ) {
    super(context, auth, router, logger, login);
    context.current.subscribe(val => this._context = val);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!super.canActivate(route, state)) {
      return false;
    // TODO Get the current user properly
    } else if (this._context.user !== this.dummy.currentUser) {
      this.logger.log('You cannot access another users settings');
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
