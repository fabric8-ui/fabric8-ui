import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';

import * as IterationActions from '.././actions/iteration.actions';
import { IterationService } from '.././services/iteration.service';
import { UpdateWorkitemIteration } from '../actions/work-item.actions';
import { IterationMapper, IterationUI } from '../models/iteration.model';

import { cleanObject, normalizeArray } from '../models/common.model';
import { SpaceQuery } from '../models/space';


@Injectable()
export class IterationEffects {
  constructor(private actions$: Actions,
               private iterationService: IterationService,
               private notifications: Notifications,
               private spaceQuery: SpaceQuery) {}

  @Effect() getIterations$: Observable<Action> = this.actions$
    .ofType(IterationActions.GET)
    .withLatestFrom(this.spaceQuery.getCurrentSpace)
    .switchMap(([action, space]) => {
      return this.iterationService.getIterations(
        space.relationships.iterations.links.related
      )
      .map(iterations => {
        const itMapper = new IterationMapper();
        return iterations.map(it => itMapper.toUIModel(it));
      })
      .map(iterations => (new IterationActions.GetSuccess(normalizeArray(iterations))))
      .catch(() => Observable.of(new IterationActions.GetError()));
    });

  @Effect() addIteration$: Observable<Action> = this.actions$
    .ofType<IterationActions.Add>(IterationActions.ADD)
    .withLatestFrom(this.spaceQuery.getCurrentSpace)
    .switchMap(([action, space]) => {
      const itMapper = new IterationMapper();
      const iteration = itMapper.toServiceModel(action.payload.iteration);
      cleanObject(iteration, ['id']);
      const url = action.payload.parent ?
        action.payload.parent.link :
        space.relationships.iterations.links.related;
      return this.iterationService.createIteration(url, iteration)
      .map(iteration => {
        return itMapper.toUIModel(iteration);
      })
      .map(iteration => {
        return new IterationActions.AddSuccess({
          iteration: iteration,
          parent: action.payload.parent ? action.payload.parent : null
        });
      })
      .catch(() => {
        try {
          this.notifications.message({
            message: `There was some problem adding the iteration.`,
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('There was some problem adding the iteration..');
        }
        return Observable.of(new IterationActions.AddError());
      });
    });

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
          return [
            new IterationActions.UpdateSuccess(iteration)
          ];
        })
        .switchMap(res => res)
        .catch(() => {
          try {
            this.notifications.message({
              message: `There was some problem updating the iteration.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.');
          }
          return Observable.of(new IterationActions.UpdateError());
        });
    });
}
