import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as InfotipActions from './../actions/infotip.actions';

import { Observable } from 'rxjs';
import { InfotipService } from './../services/infotip.service';


export type Action = InfotipActions.All;

@Injectable()
export class InfotipEffects {
  constructor(
    private actions$: Actions,
    private infotipService: InfotipService
  ){}

  @Effect() getInfotips$: Observable<Action> = this.actions$
    .ofType<InfotipActions.Get>(InfotipActions.GET)
    .switchMap(action => {
      return this.infotipService.getInfotips()
      .map(payload => {return new InfotipActions.GetSuccess(payload);})
      .catch(() => { return Observable.of(new InfotipActions.GetError())})
    }
  )
    
}