import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as WorkItemActions from './../actions/work-item.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService as WIService } from './../services/work-item.service';
import { WorkItemMapper, WorkItem, WorkItemService } from './../models/work-item';

export type Action = WorkItemActions.All;

@Injectable()
export class WorkItemEffects {
  private workItemMapper: WorkItemMapper =
    new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>
  ){}

  @Effect() addWorkItems$ = this.actions$
    .ofType<WorkItemActions.Add>(WorkItemActions.ADD)
    .withLatestFrom(this.store)
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(op => {
      const payload = op.payload;
      const state = op.state;
      const createID = payload.createId;
      const workItem = payload.workItem;
      return this.workItemService.create(workItem)
        .map(item => {
          const itemUI = this.workItemMapper.toUIModel(item);
          return new WorkItemActions.AddSuccess(null);
        })
        // .catch(() => Observable.of(
        //   new WorkItemActions.AddError()
        // ))
    })
}
