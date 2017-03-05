import {
  Component,
  OnInit,
  ViewEncapsulation,
  DoCheck
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from "../../config/action";
import { Notification } from "../notification";
import { NotificationEvent } from "../notification-event";

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'toast-notification-list-example',
  styleUrls: ['./toast-notification-list-example.component.scss'],
  templateUrl: './toast-notification-list-example.component.html'
})
export class ToastNotificationListExampleComponent implements OnInit, DoCheck {
  actionText: string = '';
  header: string = 'Default Header.';
  isPersistent: boolean;
  message: string = 'Default Message.';
  moreActions: Action[];
  moreActionsDefault: Action[];
  notifications: Notification[];
  primaryAction: Action;
  showClose: false;
  showMoreActions: boolean = false;
  types: string[] = ['success', 'info', 'danger', 'warning'];
  type: string;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.type = this.types[0];

    this.primaryAction = {
      id: "action1",
      name: 'Primary Action',
      title: ''
    } as Action;

    this.moreActionsDefault = [{
      id: 'moreActions1',
      name: 'Action',
      title: 'Perform an action'
    },{
      id: 'moreActions2',
      name: 'Another Action',
      title: 'Do something else'
    },{
      id: 'moreActions3',
      isDisabled: true,
      name: 'Disabled Action',
      title: 'Unavailable action'
    },{
      id: 'moreActions4',
      name: 'Something Else',
      title: ''
    },{
      id: 'moreActions5',
      isSeparator: true
    },{
      id: 'moreActions6',
      name: 'Grouped Action 1',
      title: 'Do something'
    },{
      id: 'moreActions7',
      name: 'Grouped Action 2',
      title: 'Do something similar'
    },
    {
      id: 'moreActions8',
      name: 'Action with callback',
      title: 'Action with a callback that performs a console log',
      callback: () => console.log('cheese!')
    }] as Action[];
  }

  ngDoCheck(): void {
    if (this.showMoreActions === true) {
      this.moreActions = this.moreActionsDefault;
    } else {
      this.moreActions = undefined;
    }
  }

  // Action functions

  handleAction($event: NotificationEvent): void {
    this.actionText = $event.action.name + '\n' + this.actionText;
    if ($event.action && $event.action.callback) $event.action.callback();
  }

  handleClose($event: NotificationEvent): void {
    this.actionText = "Close" + '\n' + this.actionText;
    this.notifications.pop();
  }

  handleType(item: string): void {
    this.type = item;
  }

  handleViewingChange($event: NotificationEvent):void {
    //Notifications.setViewing(data, viewing);
  }

  notify():void {
    this.notifications = [{
      header: this.header,
      isPersistent: this.isPersistent,
      message: this.message,
      moreActions: this.moreActions,
      primaryAction: this.primaryAction,
      showClose: this.showClose,
      type: this.type
    }] as Notification[];
  }
}
