import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Observable } from 'rxjs';
import * as FilterActions from './../actions/filter.actions';
import { FilterModel } from './../models/filter.model';
import {
  FilterService
} from './../services/filter.service';
import { AppState } from './../states/app.state';

export type Action = FilterActions.All;

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private filterService: FilterService,
    private notifications: Notifications,
    private store: Store<AppState>
  ) {}

  @Effect() GetFilters$: Observable<Action> = this.actions$
    .ofType(FilterActions.GET)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .switchMap(([action, space]) => {
      return this.filterService.getFilters2(space.links.filters)
        .map((types: FilterModel[]) => {
          return new FilterActions.GetSuccess(types);
        })
        .catch(e => {
          try {
            this.notifications.message({
              message: 'Problem in fetching filters.',
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in fetching filters');
          }
          return Observable.of(new FilterActions.GetError());
        });
    });
}
