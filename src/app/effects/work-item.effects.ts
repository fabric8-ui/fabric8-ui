import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as WorkItemActions from './../actions/work-item.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import { WorkItem } from './../models/work-item';

export type Action = WorkItemActions.All;

@Injectable()
export class WorkItemEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>
  ){}

  @Effect() getWorkItems$ = this.actions$
    .ofType<WorkItemActions.Get>(WorkItemActions.GET)
    .map(action => action.payload)
    .do(payload => {
      this.workItemService.getWorkItems2(payload.pageSize, payload.filters)
        .subscribe(workItems => {
          this.store.dispatch(new WorkItemActions.GetSuccess(workItems));
        })
    })

  @Effect() addWorkItems$ = this.actions$
    .ofType<WorkItemActions.Add>(WorkItemActions.ADD)
    .map(action => action.payload)
    .do(payload => {
      this.workItemService.create(payload)
        .subscribe(workItem => {
          this.store.dispatch(new WorkItemActions.AddSuccess(workItem));
        })
    })

  @Effect() updateWorkItem$ = this.actions$
    .ofType<WorkItemActions.Update>(WorkItemActions.UPDATE)
    .map(action => action.payload)
    .do(payload => {
      this.workItemService.update(payload)
        .subscribe(workItem => {
          this.store.dispatch(new WorkItemActions.UpdateSuccess(workItem));
        })
    })
}
