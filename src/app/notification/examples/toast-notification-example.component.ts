import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from '../../config/action';
import { NotificationConfig } from "../notification-config";

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'toast-notification-example',
  styles: [ require('./toast-notification-example.component.css') ],
  template: require('./toast-notification-example.component.html')
})
export class ToastNotificationExampleComponent implements OnInit {
  actionText: string = '';
  config: NotificationConfig;
  moreActions: Action[];
  showMoreActions: boolean = false;
  types: string[];

  constructor(private router: Router) {
    this.types = ['success', 'info', 'danger', 'warning'];

    this.moreActions = [{
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

    this.config = {
      actionsConfig: {
        primaryActions: [{
          id: "action1",
          name: 'Primary Action',
          title: ''
        }]
      },
      header: 'Default Header.',
      message: 'Default Message.',
      showClose: false,
      type: 'success'
    } as NotificationConfig;
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    if (this.showMoreActions === true) {
      this.config.actionsConfig.moreActions = this.moreActions;
    } else {
      this.config.actionsConfig.moreActions = undefined;
    }
  }

  // Action functions

  handleAction($event: Action): void {
    this.actionText = $event.name + '\n' + this.actionText;
  }

  handleClose($event: Action): void {
    this.actionText = "Close" + '\n' + this.actionText;
  }

  handleType(item: string): void {
    this.config.type = item;
  }
}
