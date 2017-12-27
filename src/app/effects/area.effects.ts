import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AreaActions from './../actions/area.actions';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';

import { AreaService } from './../services/area.service';

export type Action = AreaActions.All;

@Injectable()
export class AreaEffects {
  constructor(
    private actions$: Actions,
    private areaService: AreaService
  ){}

  @Effect() getAreas$: Observable<Action> = this.actions$
    .ofType(AreaActions.GET)
    .switchMap(action => {
      return this.areaService.getAreas()
        .map(areas => (new AreaActions.GetSuccess(areas)))
    })
}
