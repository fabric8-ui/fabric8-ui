import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from '../../config/action';
import { ActionsConfig } from '../../config/actions-config';
import { Filter } from '../../filters/filter';
import { FilterConfig } from '../../filters/filter-config';
import { FilterField } from '../../filters/filter-field';
import { FilterEvent } from '../../filters/filter-event';
import { SortConfig } from "../../sort/sort-config";
import { SortField } from "../../sort/sort-field";
import { SortEvent } from "../../sort/sort-event";
import { ToolbarConfig } from "../toolbar-config";
import { View } from '../../config/view';
import { ViewsConfig } from '../../config/views-config';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'toolbar-example',
  styleUrls: ['./toolbar-example.component.scss'],
  templateUrl: './toolbar-example.component.html'
})
export class ToolbarExampleComponent implements OnInit {
  @ViewChild('actions') actionsTemplate: TemplateRef<any>;

  actionsConfig: ActionsConfig;
  actionsText: string = "";
  allItems: any[];
  filterConfig: FilterConfig;
  filtersText: string = "";
  items: any[];
  isAscendingSort: boolean = true;
  sortConfig: SortConfig;
  currentSortField: SortField;
  toolbarConfig: ToolbarConfig;
  viewsConfig: ViewsConfig;
  view: View;

  monthVals: any = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
  };

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.allItems = [{
      name: "Fred Flintstone",
      address: "20 Dinosaur Way, Bedrock, Washingstone",
      birthMonth: 'February'
    },{
      name: "John Smith", address: "415 East Main Street, Norfolk, Virginia",
      birthMonth: 'October'
    },{
      name: "Frank Livingston",
      address: "234 Elm Street, Pittsburgh, Pennsylvania",
      birthMonth: 'March'
    },{
      name: "Judy Green",
      address: "2 Apple Boulevard, Cincinatti, Ohio",
      birthMonth: 'December'
    },{
      name: "Pat Thomas",
      address: "50 Second Street, New York, New York",
      birthMonth: 'February'
    }];
    this.items = this.allItems;

    this.filterConfig = {
      fields: [{
        id: 'name',
        title:  'Name',
        placeholder: 'Filter by Name...',
        type: 'text'
      },{
        id: 'age',
        title:  'Age',
        placeholder: 'Filter by Age...',
        type: 'text'
      },{
        id: 'address',
        title:  'Address',
        placeholder: 'Filter by Address...',
        type: 'text'
      },{
        id: 'birthMonth',
        title:  'Birth Month',
        placeholder: 'Filter by Birth Month...',
        type: 'select',
        queries: [{
          id: 'month1',
          value: 'January'
        },{
          id: 'month2',
          value: 'February'
        },{
          id: 'month3',
          value: 'March'
        },{
          id: 'month4',
          value: 'April'
        },{
          id: 'month5',
          value: 'May'
        },{
          id: 'month6',
          value: 'June'
        },{
          id: 'month7',
          value: 'July'
        },{
          id: 'month8',
          value: 'August'
        },{
          id: 'month9',
          value: 'September'
        },{
          id: 'month10',
          value: 'October'
        },{
          id: 'month11',
          value: 'November'
        },{
          id: 'month12',
          value: 'December'
        }]
      }] as FilterField[],
      appliedFilters: [],
      resultsCount: this.items.length,
      tooltipPlacement: "right"
    } as FilterConfig;

    this.sortConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          sortType: 'alpha'
        },
        {
          id: 'age',
          title:  'Age',
          sortType: 'numeric'
        },
        {
          id: 'address',
          title:  'Address',
          sortType: 'alpha'
        },
        {
          id: 'birthMonth',
          title:  'Birth Month',
          sortType: 'alpha'
        }
      ],
      isAscending: this.isAscendingSort
    } as SortConfig;

    this.actionsConfig = {
      primaryActions: [
        {
          id: 'action1',
          name: 'Action 1',
          title: 'Do the first thing'
        },
        {
          id: 'action2',
          name: 'Action 2',
          title: 'Do something else'
        }
      ],
      moreActions: [
        {
          id: 'moreActions1',
          name: 'Action',
          title: 'Perform an action'
        },
        {
          id: 'moreActions2',
          name: 'Another Action',
          title: 'Do something else'
        },
        {
          id: 'moreActions3',
          name: 'Disabled Action',
          title: 'Unavailable action',
          isDisabled: true
        },
        {
          id: 'moreActions4',
          name: 'Something Else',
          title: ''
        },
        {
          id: 'moreActions5',
          name: '',
          isSeparator: true
        },
        {
          id: 'moreActions6',
          name: 'Grouped Action 1',
          title: 'Do something'
        },
        {
          id: 'moreActions7',
          name: 'Grouped Action 2',
          title: 'Do something similar'
        }
      ]
    } as ActionsConfig;

    this.viewsConfig = {
      views: [
        {
          id: 'listView',
          title: 'List View',
          iconClass: 'fa fa-th-list'
        },
        {
          id: 'tableView',
          title: 'Table View',
          iconClass: 'fa fa-table'
        }
      ],
    } as ViewsConfig;

    this.viewsConfig.currentView = this.viewsConfig.views[0];
    this.view = this.viewsConfig.currentView;

    this.toolbarConfig = {
      actionsConfig: this.actionsConfig,
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig,
      viewsConfig: this.viewsConfig
    } as ToolbarConfig;
  }

  // Action functions

  doAdd(): void {
    this.actionsText = "Add Action\n" + this.actionsText;
  }

  optionSelected(option: number): void {
    this.actionsText = "Option " + option + " selected\n" + this.actionsText;
  }

  performAction(action: Action): void {
    this.actionsText = action.name + "\n" + this.actionsText;
    let test = "";
  }

  // Filter functions

  applyFilters(filters: Filter[]): void {
    this.items = [];
    if (filters && filters.length > 0) {
      this.allItems.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.items.push(item);
        }
      });
    } else {
      this.items = this.allItems;
    }
    this.toolbarConfig.filterConfig.resultsCount = this.items.length;
  }

  filterChange($event: FilterEvent): void {
    this.filtersText = "";
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + " : " + filter.value + "\n";
    });
    this.applyFilters($event.appliedFilters);
  }

  matchesFilter(item: any, filter: Filter): boolean {
    let match = true;

    if (filter.field.id === 'name') {
      match = item.name.match(filter.value) !== null;
    } else if (filter.field.id === 'address') {
      match = item.address.match(filter.value) !== null;
    } else if (filter.field.id === 'birthMonth') {
      match = item.birthMonth === filter.value;
    }
    return match;
  }

  matchesFilters(item: any, filters: Filter[]): boolean {
    let matches = true;

    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return false;
      }
    });
    return matches;
  }

  // Sort functions

  compare(item1: any, item2: any): number {
    var compValue = 0;
    if (this.currentSortField.id === 'name') {
      compValue = item1.name.localeCompare(item2.name);
    } else if (this.currentSortField.id === 'age') {
      compValue = item1.age - item2.age;
    } else if (this.currentSortField.id === 'address') {
      compValue = item1.address.localeCompare(item2.address);
    } else if (this.currentSortField.id === 'birthMonth') {
      compValue = this.monthVals[item1.birthMonth] - this.monthVals[item2.birthMonth];
    }

    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.items.sort((item1: any, item2: any) => this.compare(item1, item2));
  }

  // View functions

  viewSelected(view: View): void {
    this.view = view;
    this.sortConfig.show = (this.view.id === "tableView" ? false : true);
  }
}
