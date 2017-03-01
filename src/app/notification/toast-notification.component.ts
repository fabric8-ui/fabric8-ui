import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { Action } from '../config/action';
import { NotificationConfig } from './notification-config';

import * as _ from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-toast-notification',
  styleUrls: ['./toast-notification.component.scss'],
  templateUrl: './toast-notification.component.html'
})
export class ToastNotificationComponent implements OnInit {
  @Input() config: NotificationConfig;

  @Output('onActionSelect') onActionSelect = new EventEmitter();
  @Output('onCloseSelect') onCloseSelect = new EventEmitter();
  @Output('onMouseEnter') onMouseEnter = new EventEmitter();
  @Output('onMouseLeave') onMouseLeave = new EventEmitter();

  prevConfig: NotificationConfig;
  showCloseButton: boolean = false;

  constructor() {
  }

  // Initialization

  ngOnInit(): void {
    this.setupConfig();
  }

  ngDoCheck(): void {
    // Do a deep compare on config
    if (!_.isEqual(this.config, this.prevConfig)) {
      this.setupConfig();
    }
  }

  setupConfig(): void {
    this.prevConfig = _.cloneDeep(this.config);

    this.showCloseButton = (this.config.showClose === true)
      && (this.config.actionsConfig.moreActions === undefined
        || this.config.actionsConfig.moreActions.length === 0);
  }

  // Action functions

  handleAction(action: Action): void {
    if (action && action.isDisabled !== true) {
      this.onActionSelect.emit(action);
    }
  }

  handleClose($event: MouseEvent): void {
    this.onCloseSelect.emit($event);
  }

  handleEnter($event: MouseEvent): void {
    this.onMouseEnter.emit($event);
  }

  handleLeave($event: MouseEvent): void {
    this.onMouseLeave.emit($event);
  }
}
