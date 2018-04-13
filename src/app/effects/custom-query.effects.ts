import { Store } from '@ngrx/store';
import { AppState } from './../states/app.state';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CustomQueryActions from './../actions/custom-query.actions';
import { Observable } from 'rxjs';
import {
  CustomQueryService
} from './../services/custom-query.service';
import { CustomQueryModel } from './../models/custom-query.model';
import {
  Notification,
  Notifications,
  NotificationType
} from "ngx-base";

export type Action = CustomQueryActions.All;

@Injectable()
export class CustomQueryEffects {
  constructor(
    private actions$: Actions,
    private customQueryService: CustomQueryService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {}

  @Effect() GetCustomQueries$: Observable<Action> = this.actions$
    .ofType(CustomQueryActions.GET)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .switchMap(([action, space]) => {
      return this.customQueryService.getCustomQueries(
        space.links.self + '/queries'
      )
      .map((types: CustomQueryModel[]) => {
        types = types.map((t) => {
          t['selected'] = false;
          return t;
        })
        return new CustomQueryActions.GetSuccess(types);
      })
      .catch(e => {
        try {
          this.notifications.message({
            message: 'Problem in fetching custom queries.',
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('Problem in fetching custom queries');
        }
        return Observable.of(new CustomQueryActions.GetError());
      })
    })

  @Effect() addCustomQuery$ = this.actions$
    .ofType<CustomQueryActions.Add>(CustomQueryActions.ADD)
    .ofType(CustomQueryActions.ADD)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .switchMap(([action, space]) => {
      let payload = action.payload;
      return this.customQueryService.create(
        payload,
        space.links.self + '/queries'
      )
      .map(customQuery => {
        customQuery['selected'] = true;
        let customQueryName = customQuery.attributes.title;
        if (customQueryName.length > 15) {
          customQueryName = customQueryName.slice(0, 15) + '...';
        }
        try {
          this.notifications.message({
            message: `${customQueryName} added.`,
            type: NotificationType.SUCCESS
          } as Notification);
        } catch (e) {
          console.log('Custom query added.')
        }
        return new CustomQueryActions.AddSuccess(customQuery);
      })
      .catch(() => {
        try {
          this.notifications.message({
            message: `There was some problem creating custom query.`,
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('There was some problem creating custom query.')
        }
        return Observable.of(new CustomQueryActions.AddError());
      })
    })
}
