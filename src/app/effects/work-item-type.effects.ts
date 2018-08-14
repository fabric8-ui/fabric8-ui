import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Observable } from 'rxjs';
import * as WIStateActoins from './../actions/work-item-state.actions';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';
import {
  WorkItemTypeMapper,
  WorkItemTypeService
} from './../models/work-item-type';
import { WorkItemService } from './../services/work-item.service';
import { AppState } from './../states/app.state';

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
    .withLatestFrom(this.store.select('planner').select('space'))
    .switchMap(([action, space]) => {
      return this.workItemService.getWorkItemTypes2(
        space.relationships.workitemtypes.links.related
      )
      .map(types => types.filter(t => t.attributes['can-construct']))
      .map((types: WorkItemTypeService[]) => {
        const witm = new WorkItemTypeMapper();
        const wiTypes = types.map(t => witm.toUIModel(t));
        this.store.dispatch(new WIStateActoins.GetSuccess(types));
        return new WorkItemTypeActions.GetSuccess(wiTypes);
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
      });
    });
}
