import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as SpaceActions from './../actions/space.actions';
import { Observable } from 'rxjs';
import { Spaces, Space } from 'ngx-fabric8-wit';


export type Action = SpaceActions.All;

@Injectable()
export class SpaceEffects {
  constructor(
    private actions$: Actions,
    private spaces: Spaces
  ){}

  @Effect() getSpace$: Observable<Action> = this.actions$
    .ofType(SpaceActions.GET)
    .switchMap(action => {
      return this.spaces.current
        .map((space: Space) => {
          return new SpaceActions.GetSuccess(space);
        })
    })
}
