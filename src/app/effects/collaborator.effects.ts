import { UserService } from 'ngx-login-client';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CollaboratorActions from './../actions/collaborator.actions';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';
import {
  CollaboratorService as CollabService
} from './../services/collaborator.service';
import {
  UserService as UserServiceModel,
  UserMapper
} from './../models/user';

export type Action = CollaboratorActions.All;

@Injectable()
export class CollaboratorEffects {
  constructor(
    private actions$: Actions,
    private collaboratorService: CollabService,
    private userService: UserService
  ) {}

  @Effect() getCollaborators$: Observable<Action> = this.actions$
    .ofType(CollaboratorActions.GET)
    .switchMap(action => {
      return this.collaboratorService.getCollaborators()
        .map((collaborators: UserServiceModel[]) => {
          const collabM = new UserMapper();
          return collaborators.map(c => collabM.toUIModel(c))
        })
        .mergeMap(collaborators => {
          // resolving loggedin user
          return this.userService.loggedInUser
            .map(user => {
              if (user) {
                collaborators.map(c => {
                  c.currentUser = c.id === user.id;
                  return c;
                })
              }
              return new CollaboratorActions.GetSuccess(collaborators);
            })
        })
    })
}
