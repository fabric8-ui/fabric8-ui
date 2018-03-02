import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AreaActions from './../actions/area.actions';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';
import { Notification, Notifications, NotificationType } from "ngx-base";

import { AreaService as AService } from './../services/area.service';
import {
  AreaService,
  AreaMapper
} from './../models/area.model';

export type Action = AreaActions.All;

@Injectable()
export class AreaEffects {
  constructor(
    private actions$: Actions,
    private areaService: AService,
    private notifications: Notifications
  ){}

  @Effect() getAreas$: Observable<Action> = this.actions$
    .ofType(AreaActions.GET)
    .switchMap(() => {
      return this.areaService.getAreas()
        .map((areas: AreaService[]) => {
          const aMapper = new AreaMapper();
          return new AreaActions.GetSuccess(
            areas.map(a => aMapper.toUIModel(a))
          )
        })
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem in fetching Areas.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in fetching Areas.');
          }
          return Observable.of(
            new AreaActions.GetError()
          );
        });
    });
}
