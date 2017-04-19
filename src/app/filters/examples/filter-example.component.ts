import {
  Component,
  OnInit,
} from '@angular/core';

import { Router } from '@angular/router';

import { Filter } from "../filter";
import { FilterConfig } from "../filter-config";
import { FilterField } from "../filter-field";
import { FilterEvent } from "../filter-event";

@Component({
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'filter-example',
  styleUrls: ['./filter-example.component.scss'],
  templateUrl: './filter-example.component.html'
})
export class FilterExampleComponent implements OnInit {
  allItems: any[];
  items: any[];
  filterConfig: FilterConfig;
  filtersText: string = "";
  savedFIlterFieldQueries: any = {};
  typeAheadFixed: any[];
  separator: Object;
  typeahedFilterableQueries: any[];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.allItems = [{
      name: "Fred Flintstone",
      address: "20 Dinosaur Way, Bedrock, Washingstone",
      birthMonth: 'February',
      birthMonthId: 'month2',
      weekDay: 'Sunday',
      weekdayId: 'day1'
    },{
      name: "John Smith", address: "415 East Main Street, Norfolk, Virginia",
      birthMonth: 'October',
      birthMonthId: '10',
      weekDay: 'Monday',
      weekdayId: 'day2'
    },{
      name: "Frank Livingston",
      address: "234 Elm Street, Pittsburgh, Pennsylvania",
      birthMonth: 'March',
      birthMonthId: 'month3',
      weekDay: 'Tuesday',
      weekdayId: 'day3'
    },{
      name: "Judy Green",
      address: "2 Apple Boulevard, Cincinatti, Ohio",
      birthMonth: 'December',
      birthMonthId: 'month12',
      weekDay: 'Wednesday',
      weekdayId: 'day4'
    },{
      name: "Pat Thomas",
      address: "50 Second Street, New York, New York",
      birthMonth: 'February',
      birthMonthId: 'month2',
      weekDay: 'Thursday',
      weekdayId: 'day5'
    }];
    this.items = this.allItems;

    this.typeAheadFixed = [{
          id: 'item10',
          value: 'Item 10',
          imageUrl: 'https://www.gravatar.com/avatar/2a997434d1fae552db7e114c4adb2479.jpg'
        },{
          id: 'item20',
          value: 'Item 20',
          imageUrl: 'https://www.gravatar.com/avatar/2a997434d1fae552db7e114c4adb2479.jpg'
      }];

      this.separator = {
          id: 'separator',
          value: null,
          separator: true
      };

      this.typeahedFilterableQueries = [{
          id: 'item1',
          value: 'Item 1',
          imageUrl: 'https://www.gravatar.com/avatar/2a997434d1fae552db7e114c4adb2479.jpg'
        },{
          id: 'item2',
          value: 'Item 2',
          imageUrl: 'https://www.gravatar.com/avatar/2a997434d1fae552db7e114c4adb2479.jpg'
        },{
          id: 'item3',
          value: 'Item 3',
          imageUrl: 'https://www.gravatar.com/avatar/2a997434d1fae552db7e114c4adb2479.jpg'
    }];

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
      },
      {
        id: 'weekDay',
        title:  'Week Day',
        placeholder: 'Filter by Week Day...',
        type: 'typeahead',
        queries: [{
          id: 'day1',
          value: 'Sunday'
        },{
          id: 'day2',
          value: 'Monday'
        },{
          id: 'day3',
          value: 'Tuesday'
        },{
          id: 'day4',
          value: 'Wednesday'
        },{
          id: 'day5',
          value: 'Thursday'
        },{
          id: 'day6',
          value: 'Friday'
        },{
          id: 'day7',
          value: 'Saturday'
        }]
      },
      {
        id: 'withimage',
        title: 'With Image',
        placeholder: 'Filter by Items...',
        type: 'typeahead',
        queries: [
          ...this.typeAheadFixed,
          this.separator,
          ...this.typeahedFilterableQueries
        ]
      },
      {
        id: 'withicon',
        title: 'With Icon',
        placeholder: 'Filter by Icons...',
        type: 'select',
        queries: [{
          id: 'bookmark',
          value: 'Bookmark',
          iconClass: 'fa-bookmark'
        },{
          id: 'map',
          value: 'Map',
          iconClass: 'fa-map-marker'
        },{
          id: 'gift',
          value: 'Gift',
          iconClass: 'fa-gift'
        }]
      }] as FilterField[],
      resultsCount: this.items.length,
      appliedFilters: []
    } as FilterConfig;

    this.filterConfig.fields
      .forEach((field) => {
        this.savedFIlterFieldQueries[field.id] = {};
        this.savedFIlterFieldQueries[field.id]['filterable'] = this.typeahedFilterableQueries;
        this.savedFIlterFieldQueries[field.id]['fixed'] = this.typeAheadFixed;
        this.savedFIlterFieldQueries[field.id]['separator'] = [this.separator];
      });
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
    this.filterConfig.resultsCount = this.items.length;
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
    } else if (filter.field.id === 'weekDay') {
      match = item.weekDay === filter.value;
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

  filterQueries(event: any) {
    const index = this.filterConfig.fields.findIndex(i => i.id === event.field.id);
    let inp = event.text.trim();

    if (inp) {
      this.filterConfig.fields[index].queries = [
        ...this.savedFIlterFieldQueries[event.field.id]['fixed'],
        ...this.savedFIlterFieldQueries[event.field.id]['separator'],
        ...this.savedFIlterFieldQueries[event.field.id]['filterable'].filter((item: any) => {
          if (item.value) {
            return item.value.toLowerCase().indexOf(inp.toLowerCase()) > -1;
          } else {
            return true;
          }
        })
      ];
    }
    if (!this.filterConfig.fields[index].queries.length && inp === '') {
      this.filterConfig.fields[index].queries = [
        ...this.savedFIlterFieldQueries[event.field.id]['fixed'],
        ...this.savedFIlterFieldQueries[event.field.id]['separator'],
        ...this.savedFIlterFieldQueries[event.field.id]['filterable']
      ];
    }
  }
}
