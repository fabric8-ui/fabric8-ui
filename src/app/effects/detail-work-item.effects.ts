import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Observable } from 'rxjs';
import * as DetailWorkItemActions from './../actions/detail-work-item.actions';
import {
  WorkItem, WorkItemMapper,
  WorkItemService,
  WorkItemUI
} from './../models/work-item';
import { WorkItemService as WIService } from './../services/work-item.service';
import { AppState } from './../states/app.state';

export type Action = DetailWorkItemActions.All;

@Injectable()
export class DetailWorkItemEffects {
  private workItemMapper: WorkItemMapper =
    new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {}

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
      let wid = this.workItemMapper.toDynamicUIModel(
        wi, state.workItemTypes.entities[workItemUI.type].dynamicfields
      );
      return { ...workItemUI, ...wid };
    });
  }

  @Effect() getWorkItem$: Observable<Action> = this.actions$
    .ofType<DetailWorkItemActions.GetWorkItem>(DetailWorkItemActions.GET_WORKITEM)
    .withLatestFrom(this.store.select('planner'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(wp => {
      const state = wp.state;
      const payload = wp.payload;
      const workItem = Object.keys(state.workItems.entities)
        .map(id => state.workItems.entities[id])
        .find(w => w.number === payload.number);
      // If work item found in the existing list
      if (workItem) {
        return Observable
          .of(new DetailWorkItemActions.GetWorkItemSuccess(workItem));
      }

      // Else fetch it from the server
      const spaceName = state.space.attributes.name;
      const spaceOwner =
        state.space.relationalData.creator.attributes.username;
      return this.workItemService
        .getWorkItemByNumber(payload.number, spaceOwner, spaceName)
        .map((data: WorkItemService) => {
          const wi = this.resolveWorkItems([data], state);
          return new DetailWorkItemActions.GetWorkItemSuccess(wi[0]);
        })
        .catch (e => {
          try {
            this.notifications.message({
              message: `Problem in getting work item.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in getting work item.');
          }
          return Observable.of(new DetailWorkItemActions.GetWorkItemError());
        });
    });
}
