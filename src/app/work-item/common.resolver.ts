import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { IterationService } from '../iteration/iteration.service';
import { IterationModel } from '../models/iteration.model';
import { UserService } from '../user/user.service';
import { User } from '../models/user';


@Injectable()
export class UsersResolve implements Resolve<User[]> {
  constructor(private userService: UserService) {}
  resolve() {
    console.log('call users');
    return this.userService.getAllUsers();
  }
}

@Injectable()
export class AuthUserResolve implements Resolve<any> {
  constructor(private userService: UserService) {}
  resolve() {
    return this.userService.getUser();
  }
}

@Injectable()
export class IterationsUrlResolve implements Resolve<String[]> {
  constructor(private iterationService: IterationService) {}
  resolve() {
    console.log('call iterations url');
    return this.iterationService.getIterationUrl();
  }
}

@Injectable()
export class IterationsResolve implements Resolve<IterationModel[]> {
  constructor(private iterationService: IterationService) {}
  resolve() {
    console.log('call iterations');
    return this.iterationService.getAllIterations();
  }
}






