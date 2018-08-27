import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Observable } from 'rxjs';
import * as LabelActions from './../actions/label.actions';
import { LabelMapper } from './../models/label.model';
import { LabelService } from './../services/label.service';
import { AppState } from './../states/app.state';

export type Action = LabelActions.All;

@Injectable()
export class LabelEffects {
  constructor(
    private actions$: Actions,
    private labelService: LabelService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {}

  @Effect() getLabels$: Observable<Action> = this.actions$
    .ofType(LabelActions.GET)
    .withLatestFrom(this.store.select('planner').select('space'))
    .switchMap(([action, space]) => {
      return this.labelService.getLabels(space.links.self + '/labels')
      .map(labels => {
         const lMapper = new LabelMapper();
         return labels.map(l => lMapper.toUIModel(l));
      })
      .map(labels => new LabelActions.GetSuccess(labels))
      .catch(() => Observable.of(new LabelActions.GetError()));
    });

  @Effect() createLabel$: Observable<Action> = this.actions$
    .ofType<LabelActions.Add>(LabelActions.ADD)
    .withLatestFrom(this.store.select('planner').select('space'))
    .switchMap(([action, space])  => {
      return this.labelService.createLabel(action.payload, space.links.self + '/labels')
        .map(label => {
          const lMapper = new LabelMapper();
          let labelUI = lMapper.toUIModel(label);
          return new LabelActions.AddSuccess(labelUI);
        })
        .catch(e => {
          try {
            this.notifications.message({
              message: `There was some problem in adding the label.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('There was some problem in adding the label.');
          }
          return Observable.of(new LabelActions.AddError());
        });
    });
}
