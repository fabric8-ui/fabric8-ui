import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { Action } from '../config/action';
import { Notification } from './notification';
import { NotificationEvent } from './notification-event';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-toast-notification',
  styleUrls: ['./toast-notification.component.scss'],
  templateUrl: './toast-notification.component.html'
})
export class ToastNotificationComponent implements OnInit {
  @Input() data: Notification;
  @Input() header: string;
  @Input() message: string;
  @Input() moreActions: Action[];
  @Input() primaryAction: Action;
  @Input() showClose: boolean;
  @Input() type: string;

  @Output('onActionSelect') onActionSelect = new EventEmitter();
  @Output('onCloseSelect') onCloseSelect = new EventEmitter();
  @Output('onViewingChange') onViewingChange = new EventEmitter();

  showCloseButton: boolean = false;

  constructor() {
  }

  // Initialization

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.showCloseButton = (this.showClose === true)
        && (this.moreActions === undefined
        || this.moreActions.length === 0);
  }

  // Action functions

  handleAction(action: Action): void {
    if (action && action.isDisabled !== true) {
      this.onActionSelect.emit({
        action: action,
        data: this.data
      } as NotificationEvent);
    }
  }

  handleClose($event: MouseEvent): void {
    this.onCloseSelect.emit({data: this.data} as NotificationEvent);
  }

  handleEnter($event: MouseEvent): void {
    this.onViewingChange.emit({
      data: this.data,
      isViewing: true
    } as NotificationEvent);
  }

  handleLeave($event: MouseEvent): void {
    this.onViewingChange.emit({
      data: this.data,
      isViewing: false
    } as NotificationEvent);
  }
}
