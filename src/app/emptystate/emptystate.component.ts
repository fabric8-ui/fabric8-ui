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
import { EmptyStateConfig } from './emptystate-config';

import * as _ from 'lodash';

/**
 * Empty state component.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-emptystate',
  styleUrls: ['./emptystate.component.scss'],
  templateUrl: './emptystate.component.html'
})
export class EmptyStateComponent implements OnInit {
  @Input() config: EmptyStateConfig;

  @Output('onActionSelect') onActionSelect = new EventEmitter();

  mainActions: Action[];
  prevConfig: EmptyStateConfig;
  secondaryActions: Action[];

  defaultConfig = {
    title: 'No Items Available'
  } as EmptyStateConfig;

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
    if (this.config !== undefined) {
      _.defaults(this.config, this.defaultConfig);
    } else {
      this.config = _.cloneDeep(this.defaultConfig);
    }

    this.mainActions = (this.config.actions !== undefined)
      ? this.config.actions.filter(item => item.type === 'main') : undefined;
    this.secondaryActions = (this.config.actions !== undefined)
      ? this.config.actions.filter(item => item.type !== 'main') : undefined;

    this.prevConfig = _.cloneDeep(this.config);
  }

  // Action functions

  handleAction(action: Action): void {
    if (action && action.disabled !== true) {
      this.onActionSelect.emit(action);
    }
  }
}
