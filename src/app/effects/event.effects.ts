import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Notification, Notifications, NotificationType } from "ngx-base";
import { WorkItemService } from "./../services/work-item.service";
import { Store } from "@ngrx/store";
import { AppState } from "../states/app.state";
import { Observable } from "rxjs";
import * as EventActions from './../actions/event.action';
import { EventMapper, EventUI, EventService, EventResolver } from "../models/event.model";

export type Action = EventActions.All;

@Injectable()
export class EventEffects {
  private eventMapper: EventMapper = 
    new EventMapper();
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {
  }

  resolveEvents(events, state) {
    return events.map((event: EventService) => {
      const eventUI = this.eventMapper.toUIModel(event);
      const resolvedEvent = new EventResolver(eventUI, state);
      return {...resolvedEvent.getEvent()}
    })
  }

  @Effect() getWorkItemEvents$: Observable<Action> = this.actions$
    .ofType<EventActions.Get>(EventActions.GET)
    .withLatestFrom(this.store.select('listPage'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      }
    })
    .switchMap((cp) => {
      return this.workItemService.resolveEvents(cp.payload)
        .map((resp) => {
          let events =  resp.filter(event => event !== null).reverse();
          return this.resolveEvents(events, cp.state);
        })
        .map((events: EventUI[]) => {
          return new EventActions.GetSuccess(events);
        })
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem loading Events.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem loading Events.');
          }
          return Observable.of(new EventActions.GetError());
        })
    });
}