import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as FilterActions from './../actions/filter.actions';
import { Observable } from 'rxjs';
import {
  FilterService
} from './../services/filter.service';
import { FilterModel } from './../models/filter.model';
import {
  Notification,
  Notifications,
  NotificationType
} from "ngx-base";

export type Action = FilterActions.All;

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private filterService: FilterService,
    private notifications: Notifications
  ) {}

  @Effect() GetFilters$: Observable<Action> = this.actions$
    .ofType(FilterActions.GET)
    .switchMap(action => {
      return this.filterService.getFilters()
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
        })
    })
}
