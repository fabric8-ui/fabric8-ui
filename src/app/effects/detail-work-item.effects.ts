import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as WorkItemActions from './../actions/detail-work-item.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService as WIService } from './../services/work-item.service';
import { WorkItemMapper, WorkItem, WorkItemService, WorkItemResolver, WorkItemUI } from './../models/work-item';

export type Action = WorkItemActions.All;

@Injectable()
export class DetailWorkItemEffects {
  private workItemMapper: WorkItemMapper =
    new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>
  ){}

  resolveWorkItems(
    workItems, state,
    matchingQuery: boolean = false,
    ancestors: string[] = []
  ): WorkItemUI[] {
    const hasAncestors = !!ancestors.length;
    return workItems.map((wi: WorkItemService) => {
      const workItemUI = this.workItemMapper.toUIModel(wi);
      workItemUI.bold = matchingQuery;
      if (hasAncestors) {
        workItemUI.treeStatus = ancestors.findIndex(
          a => a === workItemUI.id
        ) > -1 ? 'expanded' : workItemUI.treeStatus;
        if (workItemUI.treeStatus === 'expanded') {
          workItemUI.childrenLoaded = true;
        }
      }
      const workItemResolver = new WorkItemResolver(workItemUI);
      workItemResolver.resolveArea(state.areas);
      workItemResolver.resolveIteration(state.iterations);
      workItemResolver.resolveCreator(state.collaborators);
      workItemResolver.resolveType(state.workItemTypes);
      workItemResolver.resolveAssignees(state.collaborators);
      workItemResolver.resolveWiLabels(state.labels);
      return workItemResolver.getWorkItem();
    });
  }

  @Effect() getWorkItem$: Observable<Action> = this.actions$
    .ofType<WorkItemActions.GetWorkItem>(WorkItemActions.GET_WORKITEM)
    .withLatestFrom(this.store.select('listPage'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(wp => {
      const state = wp.state;
      const payload = wp.payload;
      const workItem = state.workItems.find(w => w.number === payload.number);
      console.log(workItem, '####-3');
      console.log(payload, '####-4');
      if (workItem) {
        return Observable
          .of(new WorkItemActions.GetWorkItemSuccess(workItem));
      }

      return this.workItemService
        .getWorkItemByNumber(payload.number, payload.owner, payload.space)
        .map((data: WorkItemService) => {
          const wi = this.resolveWorkItems([data], state);
          return new WorkItemActions.GetWorkItemSuccess(wi[0]);
        })
    })
}
