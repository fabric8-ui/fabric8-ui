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
export class IterationsResolve implements Resolve<IterationModel[]> {
  constructor(private iterationService: IterationService) {}
  resolve() {
    return this.iterationService.getSpaces()
      .then((data) => {
        this.iterationService.getIterations(data.relationships.iterations.links.related)
        .then(iterations =>  iterations)
        .catch ((e) => {
          console.log('Some error has occured', e);
        })
      })
      .catch ((err) => {
        console.log('Spcae not found');
      });
  }
}


