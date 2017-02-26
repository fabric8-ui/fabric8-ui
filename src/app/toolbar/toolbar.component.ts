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
import { Filter } from '../filters/filter';
import { FilterEvent } from '../filters/filter-event';
import { SortEvent } from '../sort/sort-event';
import { ToolbarConfig } from './toolbar-config';
import { View } from '../config/view';

import * as _ from 'lodash';

/**
 * Standard toolbar component. Includes filtering and view selection capabilities
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-toolbar',
  styles: [ require('./toolbar.component.css').toString() ],
  template: require('./toolbar.component.html')
})
export class ToolbarComponent implements OnInit {
  @Input() config: ToolbarConfig;
  @Input() actionsTemplate: TemplateRef<any>;

  @Output('onActionSelect') onActionSelect = new EventEmitter();
  @Output('onFilterChange') onFilterChange = new EventEmitter();
  @Output('onSortChange') onSortChange = new EventEmitter();
  @Output('onViewSelect') onViewSelect = new EventEmitter();

  prevConfig: ToolbarConfig;

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

    if (this.config && this.config.filterConfig
        && this.config.filterConfig.appliedFilters === undefined) {
      this.config.filterConfig.appliedFilters = [];
    }
    if (this.config && this.config.sortConfig && this.config.sortConfig.fields === undefined) {
      this.config.sortConfig.fields = [];
    }
    if (this.config.sortConfig !== undefined && this.config.sortConfig.show === undefined) {
      this.config.sortConfig.show = true;
    }
    if (this.config && this.config.viewsConfig && this.config.viewsConfig.views === undefined) {
      this.config.viewsConfig.views = [];
    }
    if (this.config && this.config.viewsConfig
        && this.config.viewsConfig.currentView === undefined) {
      this.config.viewsConfig.currentView = this.config.viewsConfig.views[0];
    }
  }

  // Action functions

  handleAction(action: Action): void {
    if (action && action.isDisabled !== true) {
      this.onActionSelect.emit(action);
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
      this.config.filterConfig.appliedFilters.push(newFilter);
      $event.appliedFilters = this.config.filterConfig.appliedFilters;
      this.onFilterChange.emit($event);
    }
  }

  enforceSingleSelect(filter: Filter): void {
    _.remove(this.config.filterConfig.appliedFilters, {title: filter.title});
  }

  filterExists(filter: Filter): boolean {
    let foundFilter = _.find(this.config.filterConfig.appliedFilters, {
      title: filter.title,
      value: filter.value
    });
    return foundFilter !== undefined;
  }

  onClear($event: Filter[]): void {
    this.config.filterConfig.appliedFilters = $event;
    this.onFilterChange.emit({
      appliedFilters: $event
    } as FilterEvent);
  }

  // Sort functions

  sortChange($event: SortEvent): void {
    this.onSortChange.emit($event);
  }

  // View functions

  isViewSelected(view: View): boolean {
    return this.config.viewsConfig && (this.config.viewsConfig.currentView.id === view.id);
  }

  submit($event: any): void {
    $event.preventDefault();
  }

  viewSelected (view: View): void {
    this.config.viewsConfig.currentView = view;
    if (!view.isDisabled) {
      this.onViewSelect.emit(view);
    }
  }
}
