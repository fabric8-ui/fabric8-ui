import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {
  User,
  UserService
} from 'ngx-login-client';

import { IterationService } from '../iteration/iteration.service';
import { IterationModel } from '../models/iteration.model';


@Injectable()
export class UsersResolve implements Resolve<User[]> {
  constructor(private userService: UserService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.userService.getAllUsers();
  }
}

@Injectable()
export class AuthUserResolve implements Resolve<any> {
  constructor(private userService: UserService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.userService.getUser();
  }
}
