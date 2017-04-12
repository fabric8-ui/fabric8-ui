import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { AlmSearchHighlight } from '../pipes/alm-search-highlight.pipe'

import { FilterConfig } from './filter-config';
import { FilterEvent } from './filter-event';
import { FilterField } from './filter-field';
import { FilterQuery } from './filter-query';

import * as _ from 'lodash';

/**
 * Component for the filter bar's filter entry components
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-filter-fields',
  styleUrls: ['./filter-fields.component.scss'],
  templateUrl: './filter-fields.component.html'
})
export class FilterFieldsComponent implements OnInit {
  @Input() config: FilterConfig;

  @Output('onAdd') onAdd = new EventEmitter();
  @Output('onSelectType') onSelecttype = new EventEmitter();

  @ViewChild('searchField') searchField: any;
  @ViewChild('listData') listData: any;

  currentField: FilterField;
  currentValue: string;
  prevConfig: FilterConfig;
  show: boolean = false;
  filteredList:any;

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
    if (this.config && this.config.tooltipPlacement === undefined) {
      this.config.tooltipPlacement = "top";
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

  selectField(field: FilterField): void {
    this.currentField = field;
    if(field.type ==='typeahead') {
      this.filteredList = this.currentField.queries;
    };
    this.currentValue = null;
  }

  emitSelectedField() {
    if (this.currentField) {
      this.onSelecttype.emit(this.currentField);
    }
  }

  selectValue(filterQuery: FilterQuery): void {
    if (filterQuery != null) {
      this.onAdd.emit({
        field: this.currentField,
        query: filterQuery,
        value: filterQuery.value
      } as FilterEvent);
      this.currentValue = null;
    }
  }

   filterList(event: any) {
    // Down arrow or up arrow
    if (event.keyCode == 40 || event.keyCode == 38) {
      let lis = this.listData.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i == lis.length) { // No existing selected
        if (event.keyCode == 40) { // Down arrow
          lis[0].classList.add('selected');
          lis[0].scrollIntoView(false);
        } else { // Up arrow
          lis[lis.length - 1].classList.add('selected');
          lis[lis.length - 1].scrollIntoView(false);
        }
      } else { // Existing selected
        lis[i].classList.remove('selected');
        if (event.keyCode == 40) { // Down arrow
          lis[(i + 1) % lis.length].classList.add('selected');
          lis[(i + 1) % lis.length].scrollIntoView(false);
        } else { // Down arrow
          // In javascript mod gives exact mod for negative value
          // For example, -1 % 6 = -1 but I need, -1 % 6 = 5
          // To get the round positive value I am adding the divisor
          // with the negative dividend
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].classList.add('selected');
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].scrollIntoView(false);
        }
      }
    } else if (event.keyCode == 13) { // Enter key event
      let lis = this.listData.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i < lis.length) {
        let selectedId = lis[i].dataset.value;

      }
    } else {
      let inp = this.searchField.nativeElement.value.trim();
      this.filteredList = this.currentField.queries.filter((item) => {
         return item.value.toLowerCase().indexOf(inp.toLowerCase()) > -1;
      });
    }
  }
}
