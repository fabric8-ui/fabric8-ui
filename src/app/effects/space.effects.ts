import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as SpaceActions from './../actions/space.actions';
import { Observable } from 'rxjs';
import { Spaces, Space } from 'ngx-fabric8-wit';
import {
  Notification,
  Notifications,
  NotificationType
} from "ngx-base";

export type Action = SpaceActions.All;

@Injectable()
export class SpaceEffects {
  constructor(
    private actions$: Actions,
    private spaces: Spaces,
    private notifications: Notifications
  ){}

  @Effect() getSpace$: Observable<Action> = this.actions$
    .ofType(SpaceActions.GET)
    .switchMap(action => {
      return this.spaces.current
        .map((space: Space) => {
          return new SpaceActions.GetSuccess(space);
        })
        .catch(e => {
          try {
            this.notifications.message({
              message: `Problem in getting space`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in getting space');
          }
          return Observable.of(new SpaceActions.GetError());
        })
    })
}
