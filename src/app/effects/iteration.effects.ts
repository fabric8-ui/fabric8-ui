import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs";
import * as IterationActions from ".././actions/iteration.actions";
import { IterationService } from '.././services/iteration.service';
import { Action } from '@ngrx/store';
import{ IterationMapper } from "../models/iteration.model";

@Injectable()
export class IterationEffects {
  constructor( private actions$ : Actions,
               private iterationService : IterationService ) {
  }

  @Effect() getIterations$ : Observable<Action> = this.actions$
    .ofType(IterationActions.GET)
    .switchMap(action => {
      return this.iterationService.getIterations()
        .map(iterations => {
           const itMapper = new IterationMapper();
           return iterations.map(it => itMapper.toUIModel(it));
        })
       .map(iterations => (new IterationActions.GetSuccess(iterations)))
       .catch(() => Observable.of(new IterationActions.GetError()))
    });

  @Effect() addIteration$: Observable<Action> = this.actions$
    .ofType(IterationActions.ADD)
    .switchMap((action: IterationActions.Add) => {
      const iteration = action.payload.iteration;
      const parent = action.payload.parent;
      console.log('####-1', iteration);
      console.log('####-2', parent);
      return this.iterationService.getIterations()
        .map(iterations => {
           const itMapper = new IterationMapper();
           return iterations.map(it => itMapper.toUIModel(it));
        })
       .map(iterations => (new IterationActions.GetSuccess(iterations)))
       .catch(() => Observable.of(new IterationActions.GetError()))
    })
}
