import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs";
import * as IterationActions from ".././actions/iteration.actions";
import { IterationService } from '.././services/iteration.service';
import { Action } from '@ngrx/store';

@Injectable()
export class IterationEffects {
  constructor( private actions$ : Actions, 
               private iterationService : IterationService ) {
  }

  @Effect() getIterations$ : Observable<Action> = this.actions$
    .ofType(IterationActions.GET)
    .switchMap(action =>
      this.iterationService.getIterations()
           .map(iterations => (new IterationActions.GetSuccess(iterations)))
           .catch(() => Observable.of(new IterationActions.GetError())));
}