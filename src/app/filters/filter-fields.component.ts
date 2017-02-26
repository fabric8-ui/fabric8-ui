import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { FilterConfig } from './filter-config';
import { FilterEvent } from './filter-event';
import { FilterField } from './filter-field';

import * as _ from 'lodash';

/**
 * Component for the filter bar's filter entry components
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-filter-fields',
  styles: [ require('./filter-fields.component.css').toString() ],
  template: require('./filter-fields.component.html')
})
export class FilterFieldsComponent implements OnInit {
  @Input() config: FilterConfig;

  @Output('onAdd') onAdd = new EventEmitter();

  currentField: FilterField;
  currentValue: string;
  prevConfig: FilterConfig;
  show: boolean = false;

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

    if (this.config && this.config.fields === undefined) {
      this.config.fields = [];
    }

    let fieldFound: boolean = false;
    if (this.currentField !== undefined) {
      _.find(this.config.fields, (nextField) => {
        if (nextField.id === this.currentField.id) {
          fieldFound = true;
          return;
        }
      });
    }
    if (!fieldFound) {
      this.currentField = this.config.fields[0];
      this.currentValue = null;
    }
    if (this.currentValue === undefined) {
      this.currentValue = null;
    }
  }

  // Field functions

  onValueKeyPress(keyEvent: KeyboardEvent): void {
    if (keyEvent.which === 13) {
      this.onAdd.emit({
        field: this.currentField,
        value: this.currentValue
      } as FilterEvent);
      this.currentValue = undefined;
    }
  }

  selectField(item: FilterField): void {
    this.currentField = item;
    this.currentValue = null;
  }

  selectValue(filterValue: string): void {
    if (filterValue != null) {
      this.onAdd.emit({
        field: this.currentField,
        value: filterValue
      } as FilterEvent);
      this.currentValue = null;
    }
  }
}
