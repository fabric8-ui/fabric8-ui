import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from './../states/app.state';
import { Injectable } from '@angular/core';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';
import * as WIStateActoins from './../actions/work-item-state.actions';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import {
  WorkItemTypeService,
  WorkItemTypeMapper,
  WorkItemTypeResolver
} from './../models/work-item-type';
import {
  Notification,
  Notifications,
  NotificationType
} from "ngx-base";

export type Action = WorkItemTypeActions.All;

@Injectable()
export class WorkItemTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {}

  @Effect() getWorkItemTypes$: Observable<Action> = this.actions$
    .ofType(WorkItemTypeActions.GET)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .switchMap(([action, space]) => {
      return this.workItemService.getWorkItemTypes2(
        space.links.self + '/workitemtypes'
      )
      .map((types: WorkItemTypeService[]) => {
        const witm = new WorkItemTypeMapper();
        const wiTypes = types.map(t => witm.toUIModel(t));
        const witResolver = new WorkItemTypeResolver(wiTypes);
        witResolver.resolveChildren();
        this.store.dispatch(new WIStateActoins.GetSuccess(types));
        return new WorkItemTypeActions.GetSuccess(
          witResolver.getResolvedWorkItemTypes()
        );
      })
      .catch(e => {
        try {
          this.notifications.message({
            message: `Problem in fetching workitem type.`,
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('Problem in fetching work item type');
        }
        return Observable.of(new WorkItemTypeActions.GetError());
      })
    })
}
