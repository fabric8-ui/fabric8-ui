import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CollaboratorActions from './../actions/collaborator.actions';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';
import { CollaboratorService } from './../services/collaborator.service';

export type Action = CollaboratorActions.All;

@Injectable()
export class CollaboratorEffects {
  constructor(
    private actions$: Actions,
    private collaboratorService: CollaboratorService,
  ){}

  @Effect() getCollaborators$: Observable<Action> = this.actions$
    .ofType(CollaboratorActions.GET)
    .switchMap(action => {
      return this.collaboratorService.getCollaborators()
      .map(collaborators => (new CollaboratorActions.GetSuccess(collaborators)))
      .catch(() => Observable.of(new CollaboratorActions.GetError()))
    })
}
