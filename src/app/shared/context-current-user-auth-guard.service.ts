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
    return super
      .canActivate(route, state)
      .switchMap(auth => {
        if (auth) {
          return Observable.combineLatest(
            this.context.current.map(val => val.user.id).do(val => console.log('context', val)),
            this.userService.loggedInUser.map(val => val.id).do(val => console.log('user', val)),
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
        } else {
          return Observable.of(auth);
        }
      });
  }
}
