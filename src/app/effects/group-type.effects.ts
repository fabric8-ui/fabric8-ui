import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Observable } from 'rxjs';
import * as GroupTypeActions from './../actions/group-type.actions';
import {
  GroupTypeMapper,
  GroupTypeService
} from './../models/group-types.model';
import {
  GroupTypesService as GTService
} from './../services/group-types.service';
import { AppState } from './../states/app.state';

export type Action = GroupTypeActions.All;

@Injectable()
export class GroupTypeEffects {
  constructor(
    private actions$: Actions,
    private groupTypeService: GTService,
    private notifications: Notifications,
    private store: Store<AppState>
  ) {}

  @Effect() getGroupTypes$: Observable<Action> = this.actions$
    .ofType(GroupTypeActions.GET)
    .withLatestFrom(this.store.select('planner').select('space'))
    .switchMap(([action, space]) => {
      return this.groupTypeService.getGroupTypes(
          space.relationships.workitemtypegroups.links.related
        )
        .map((types: GroupTypeService[]) => {
          const gtm = new GroupTypeMapper();
          return new GroupTypeActions.GetSuccess(
            types.map(t => gtm.toUIModel(t))
          );
        })
        .catch(e => {
          try {
            this.notifications.message({
              message: `Problem in fetching grouptypes.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in fetching grouptypes.');
          }
          return Observable.of(new GroupTypeActions.GetError());
        });
    });
}
