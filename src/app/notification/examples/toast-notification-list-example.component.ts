import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from "../../config/action";
import { Notification } from "../notification";
import { NotificationEvent } from "../notification-event";
import { NotificationService } from '../notification.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'toast-notification-list-example',
  styleUrls: ['./toast-notification-list-example.component.scss'],
  templateUrl: './toast-notification-list-example.component.html'
})
export class ToastNotificationListExampleComponent implements OnInit {
  actionText: string = '';
  header: string = 'Default Header.';
  isPersistent: boolean = false;
  message: string = 'Default Message.';
  moreActions: Action[];
  moreActionsDefault: Action[];
  notifications: Notification[];
  primaryAction: Action;
  showClose: boolean = false;
  showMoreActions: boolean = false;
  type: string;
  types: string[];
  typeMap: any;

  constructor(private router: Router, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();

    this.typeMap = { 'info': Notification.INFO,
      'success': Notification.SUCCESS,
      'warning': Notification.WARNING,
      'danger': Notification.DANGER
    };
    this.types = Object.keys(this.typeMap);
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
    // Get the Action we provided and output its name
    this.actionText = $event.action.name + '\n' + this.actionText;
  }

  handleClose($event: NotificationEvent): void {
    this.actionText = "Close" + '\n' + this.actionText;
    this.notificationService.remove($event.notification);
  }

  handleType(item: string): void {
    this.type = item;
  }

  handleViewingChange($event: NotificationEvent):void {
    this.notificationService.setViewing($event.notification, $event.isViewing);
  }

  notify():void {
    this.notificationService.message(
      this.typeMap[this.type],
      this.header,
      this.message,
      this.isPersistent,
      this.primaryAction,
      this.moreActions);
  }
}
