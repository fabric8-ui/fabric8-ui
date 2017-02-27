import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from '../../config/action';
import { NotificationEvent } from "../notification-event";

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'toast-notification-example',
  styleUrls: ['./toast-notification-example.component.scss'],
  templateUrl: './toast-notification-example.component.html'
})
export class ToastNotificationExampleComponent implements OnInit {
  actionText: string = '';
  header: string = 'Default Header.';
  message: string = 'Default Message.';
  moreActions: Action[];
  moreActionsDefault: Action[];
  primaryAction: Action;
  showClose: false;
  showMoreActions: boolean = false;
  type: string;
  types: string[];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.types = ['success', 'info', 'danger', 'warning'];
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
    this.actionText = $event.action.name + '\n' + this.actionText;
  }

  handleClose($event: NotificationEvent): void {
    this.actionText = "Close" + '\n' + this.actionText;
  }

  handleType(item: string): void {
    this.type = item;
  }
}
