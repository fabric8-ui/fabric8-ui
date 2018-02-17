import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Notification, Notifications, NotificationType } from "ngx-base";
import * as WorkItemActions from './../actions/work-item.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService as WIService } from './../services/work-item.service';
import { WorkItemMapper, WorkItem, WorkItemService, WorkItemResolver } from './../models/work-item';

export type Action = WorkItemActions.All;

@Injectable()
export class WorkItemEffects {
  private workItemMapper: WorkItemMapper =
    new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>,
    private notifications: Notifications
  ){}

  @Effect() addWorkItems$ = this.actions$
    .ofType<WorkItemActions.Add>(WorkItemActions.ADD)
    .withLatestFrom(this.store.select('listPage'))
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
          const workItemResolver = new WorkItemResolver(itemUI);
          workItemResolver.resolveArea(state.areas);
          workItemResolver.resolveIteration(state.iterations);
          workItemResolver.resolveCreator(state.collaborators);
          workItemResolver.resolveType(state.workItemTypes);
          const wItem = workItemResolver.getWorkItem();
          wItem.createId = createID;
          try {
            this.notifications.message({
              message: `Work item is added.`,
              type: NotificationType.SUCCESS
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return new WorkItemActions.AddSuccess(
            wItem
          );
        })
        .catch(() => {
          try {
            this.notifications.message({
              message: `Problem adding work item.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return Observable.of(new WorkItemActions.AddError());
        })
    })
}
