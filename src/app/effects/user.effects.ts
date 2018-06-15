import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { normalizeArray } from '../models/common.model';
import * as CollaboratorActions from './../actions/collaborator.actions';
import * as UserActions from './../actions/user.actions';
import {
  UserMapper,
  UserService as UserServiceModel,
  UserUI
} from './../models/user';

export type CollabGetSuccess = CollaboratorActions.GetSuccess;
export type UserAction = UserActions.All;
export type UserGetAction = UserActions.Get;

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private notifications: Notifications
  ) {}

  @Effect() getUser$: Observable<UserAction> = this.actions$
    .ofType(UserActions.GET)
    .switchMap((action: UserGetAction) => {
      return this.userService.getUserByUserId(action.payload)
        .map((user: UserServiceModel) => {
          const userMapper = new UserMapper();
          const mappedUser: UserUI = userMapper.toUIModel(user);
          return new UserActions.Set(normalizeArray<UserUI>([mappedUser]));
        });
    })
    .catch(e => {
      try {
        this.notifications.message({
          message: `Problem in user details`,
          type: NotificationType.DANGER
        } as Notification);
      } catch (e) {
        console.log('Problem in user details');
      }
      return Observable.of(new UserActions.GetError());
    });

}
