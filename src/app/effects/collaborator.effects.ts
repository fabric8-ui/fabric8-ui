import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CollaboratorActions from './../actions/collaborator.actions';
import * as UserActions from './../actions/user.actions';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';
import {
  Notification,
  Notifications,
  NotificationType
} from "ngx-base";

import {
  CollaboratorService as CollabService
} from './../services/collaborator.service';
import {
  UserService as UserServiceModel,
  UserMapper,
  UserUI
} from './../models/user';
import { normalizeArray } from '../models/common.model';

export type Action = CollaboratorActions.All | UserActions.All;

@Injectable()
export class CollaboratorEffects {
  constructor(
    private actions$: Actions,
    private collaboratorService: CollabService,
    private notifications: Notifications,
    private store: Store<AppState>
  ) {}

  @Effect() getCollaborators$: Observable<Action> = this.actions$
    .ofType(CollaboratorActions.GET)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .switchMap(([action, space]) => {
      return this.collaboratorService.getCollaborators2(
        space.links.self + '/collaborators?page[offset]=0&page[limit]=1000'
      );
    })
    .map((collaborators: UserServiceModel[]) => {
      const collabM = new UserMapper();
      return collaborators.map(c => collabM.toUIModel(c))
    })
    .switchMap(collaborators => {
      return [
        new CollaboratorActions.GetSuccess(collaborators.map(c => c.id)),
        new UserActions.Set(normalizeArray<UserUI>(collaborators))
      ];
    })
    .catch(e => {
      try {
        this.notifications.message({
          message: `Problem in fetching collaborators`,
          type: NotificationType.DANGER
        } as Notification);
      } catch (e) {
        console.log('Problem in fetching collaborators');
      }
      return Observable.of(new CollaboratorActions.GetError());
    })
}
