import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs";
import { Action } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from "ngx-base";

import * as IterationActions from ".././actions/iteration.actions";
import { IterationService } from '.././services/iteration.service';
import{ IterationMapper, IterationUI } from "../models/iteration.model";


@Injectable()
export class IterationEffects {
  constructor( private actions$ : Actions,
               private iterationService : IterationService,
               private notifications: Notifications ) {
  }

  resolveChildren(iterations: IterationUI[]): IterationUI[] {
    for(let i = 0; i < iterations.length; i++) {
      iterations[i].children =
        iterations.filter(it => it.parentId === iterations[i].id);
    }
    return iterations;
  }

  @Effect() getIterations$ : Observable<Action> = this.actions$
    .ofType(IterationActions.GET)
    .switchMap(action => {
      return this.iterationService.getIterations()
        .map(iterations => {
           const itMapper = new IterationMapper();
           return iterations.map(it => itMapper.toUIModel(it));
        })
        .map(iterations => {
          return this.resolveChildren(iterations)
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
        .map(iteration => {
          let iterationName = iteration.name;
          if (iterationName.length > 15) {
            iterationName = iterationName.slice(0, 15) + '...';
          }
          try {
            this.notifications.message({
              message: `${iterationName} is added.`,
              type: NotificationType.SUCCESS
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return new IterationActions.AddSuccess({
            iteration, parent: parent ? itMapper.toUIModel(parent) : null
          });
        })
        .catch(() => {
          try {
            this.notifications.message({
              message: `There was some problem adding the iteration.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return Observable.of(new IterationActions.AddError());
        })
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
        .map(iteration => {
          let iterationName = iteration.name;
          if (iterationName.length > 15) {
            iterationName = iterationName.slice(0, 15) + '...';
          }
          try {
            this.notifications.message({
              message: `${iterationName} is updated.`,
              type: NotificationType.SUCCESS
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return new IterationActions.UpdateSuccess(iteration);
        })
        .catch(() => {
          try {
            this.notifications.message({
              message: `There was some problem updating the iteration.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return Observable.of(new IterationActions.UpdateError());
        })
    })
}
