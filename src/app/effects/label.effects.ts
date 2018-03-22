import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as LabelActions from './../actions/label.actions';
import { Observable } from 'rxjs';
import { LabelService } from './../services/label.service';
import { AppState } from './../states/app.state';
import { LabelMapper } from "./../models/label.model";
import {
  Notification,
  Notifications,
  NotificationType
} from "ngx-base";

export type Action = LabelActions.All;

@Injectable()
export class LabelEffects {
  constructor(
    private actions$: Actions,
    private labelService: LabelService,
    private store: Store<AppState>,
    private notifications: Notifications
  ){}

  @Effect() getLabels$: Observable<Action> = this.actions$
    .ofType(LabelActions.GET)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .switchMap(([action, space]) => {
      return this.labelService.getLabels2(space.links.self + '/labels')
      .map(labels => {
         const lMapper = new LabelMapper();
         return labels.map(l => lMapper.toUIModel(l));
      })
      .map(labels => new LabelActions.GetSuccess(labels))
      .catch(() => Observable.of(new LabelActions.GetError()))
    })

  @Effect() createLabel$: Observable<Action> = this.actions$
    .ofType<LabelActions.Add>(LabelActions.ADD)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.labelService.createLabel(payload)
        .map(label => {
          const lMapper = new LabelMapper();
          let labelUI = lMapper.toUIModel(label);
          try {
            this.notifications.message({
              message: `${labelUI.name} is added.`,
              type: NotificationType.SUCCESS
            } as Notification);
          } catch (e) {
            console.log('label is added');
          }
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
        })
    })
}
