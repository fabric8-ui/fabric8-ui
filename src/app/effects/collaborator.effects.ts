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
  UserService,
  UserMapper
} from './../models/user';

export type Action = CollaboratorActions.All;

@Injectable()
export class CollaboratorEffects {
  constructor(
    private actions$: Actions,
    private collaboratorService: CollabService,
  ) {}

  @Effect() getCollaborators$: Observable<Action> = this.actions$
    .ofType(CollaboratorActions.GET)
    .switchMap(action => {
      return this.collaboratorService.getCollaborators()
        .map((collaborators: UserService[]) => {
          const collabM = new UserMapper();
          return new CollaboratorActions.GetSuccess(
            collaborators.map(c => collabM.toUIModel(c))
          )
        })
    })
}
