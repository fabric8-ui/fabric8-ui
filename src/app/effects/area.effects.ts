import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Observable, pipe } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { normalizeArray } from '../models/common.model';
import { spaceSelector } from '../models/space';
import * as AreaActions from './../actions/area.actions';
import {
  AreaMapper,
  AreaService
} from './../models/area.model';
import { AreaService as AService } from './../services/area.service';
import { AppState } from './../states/app.state';
import { nameless } from './work-item-utils';

export type Action = AreaActions.All;

@Injectable()
export class AreaEffects {
  constructor(
    private actions$: Actions,
    private areaService: AService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {}

  @Effect() getAreas$: Observable<Action> = this.actions$
    .let(nameless(AreaActions.GET, this.store.select(spaceSelector)))
    .pipe(
      switchMap(([action, space]) => {
        return this.areaService.getAreas2(
            space.relationships.areas.links.related
          )
          .pipe(
            map((areas: AreaService[]) => {
              const aMapper = new AreaMapper();
              return areas.map(a => aMapper.toUIModel(a)).
              sort((a1, a2) => (a1.name.toLowerCase() > a2.name.toLowerCase() ? 1 : 0));
            }),
            map(areas => new AreaActions.GetSuccess(normalizeArray(areas))),
            catchError((e) => {
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
            })
          );
      })
    );
}
