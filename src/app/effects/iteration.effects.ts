import { Update } from './../actions/iteration.actions';
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
      const itMapper = new IterationMapper();
      const iteration = itMapper.toServiceModel(action.payload.iteration);
      const parent = action.payload.parent ?
        itMapper.toServiceModel(action.payload.parent) :
        null;
      return this.iterationService.createIteration(iteration, parent)
        .map(iteration => {
          return itMapper.toUIModel(iteration);
        })
       .map(iteration => new IterationActions.AddSuccess({
         iteration, parent: parent ? itMapper.toUIModel(parent) : null
        }))
       .catch(() => Observable.of(new IterationActions.AddError()))
    })

  @Effect() updateIteration$: Observable<Action> = this.actions$
    .ofType(IterationActions.UPDATE)
    .switchMap((action: IterationActions.Update) => {
      const itMapper = new IterationMapper();
      const iteration = itMapper.toServiceModel(action.payload);
      return this.iterationService.updateIteration(iteration)
        .map(iteration => {
          return itMapper.toUIModel(iteration);
        })
       .map(iteration => new IterationActions.UpdateSuccess(iteration))
       .catch(() => Observable.of(new IterationActions.UpdateError()))
    })
}
