import { Component, Input } from "@angular/core";
import { WorkItemUI } from './../../models/work-item';
import { Store } from "@ngrx/store";
import { AppState } from "../../states/app.state";
import * as EventActions from './../../actions/event.action';
import { EventQuery } from "../../models/event.model";

@Component({
  selector: 'work-item-event-wrapper',
  templateUrl: './work-item-event-wrapper.component.html',
  styleUrls: ['./../work-item-comment/work-item-comment.component.less']
})

export class WorkItemEventWrapperComponent {
  @Input('workItem') set WorkItem(workitem: WorkItemUI) {
    this.workitem = workitem;
    this.store.dispatch(new EventActions.Get(this.workitem.eventLink));
  }

  private workitem: WorkItemUI = null;

  private events = this.eventsQuery.getEventsWithModifier();

    constructor(
      private store: Store<AppState>,
      private eventsQuery: EventQuery
    ) { }
}