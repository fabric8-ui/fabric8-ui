import { Observable } from 'rxjs/Observable';
import { Contexts, Notification, Notifications, NotificationType } from 'ngx-fabric8-wit';
import { LoginService } from './login.service';
import { AuthGuard } from './../shared/auth-guard.service';
import { AuthenticationService, Logger, UserService } from 'ngx-login-client';
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

  constructor(
    private context: Contexts,
    auth: AuthenticationService,
    router: Router,
    logger: Logger,
    login: LoginService,
    private userService: UserService,
    private notifications: Notifications
  ) {
    super(auth, router, logger, login);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.combineLatest(
      this.context.current.map(val => val.user.id),
      this.userService.loggedInUser.map(val => val.id),
      (a, b) => (a === b)
    )
    .do(val => {
      if (!val) {
        this.notifications.message({
          message: `You cannot access ${state.url}`,
          type: NotificationType.WARNING
        } as Notification);
      }
    });
  }
}
