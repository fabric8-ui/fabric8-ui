import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { Filter } from './filter';
import { FilterConfig } from './filter-config';
import { FilterEvent } from './filter-event';

import * as _ from 'lodash';

/**
 * Component for the filter bar's filter entry components
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-filter',
  styles: [ require('./filter.component.css').toString() ],
  template: require('./filter.component.html')
})
export class FilterComponent implements OnInit {
  @Input() config: FilterConfig;

  @Output('onChange') onChange = new EventEmitter();

  prevConfig: FilterConfig;

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
    this.prevConfig = Object.assign({}, this.config);

    if (this.config && this.config.appliedFilters === undefined) {
      this.config.appliedFilters = [];
    }
  }

  // Filter functions

  addFilter($event: FilterEvent): void {
    let newFilter = {
      id: $event.field.id,
      title: $event.field.title,
      type: $event.field.filterType,
      value: $event.value
    } as Filter;

    if (!this.filterExists(newFilter)) {
      if (newFilter.type === 'select') {
        this.enforceSingleSelect(newFilter);
      }
      this.config.appliedFilters.push(newFilter);
      $event.appliedFilters = this.config.appliedFilters;
      this.onChange.emit($event);
    }
  }

  enforceSingleSelect(filter: Filter): void {
    _.remove(this.config.appliedFilters, {title: filter.title});
  }

  filterExists(filter: Filter): boolean {
    let foundFilter = _.find(this.config.appliedFilters, {
      title: filter.title,
      value: filter.value
    });
    return foundFilter !== undefined;
  }

  onClear($event: Filter[]): void {
    this.config.appliedFilters = $event;
    this.onChange.emit({
      appliedFilters: $event
    } as FilterEvent);
  }
}
