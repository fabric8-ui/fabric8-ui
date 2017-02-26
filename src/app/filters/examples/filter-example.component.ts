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
  styles: [ require('./filter-example.component.css') ],
  template: require('./filter-example.component.html')
})
export class FilterExampleComponent implements OnInit {
  allItems: any[];
  items: any[];
  filterConfig: FilterConfig;
  filtersText: string = "";

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.allItems = [
      {
        name: "Fred Flintstone",
        address: "20 Dinosaur Way, Bedrock, Washingstone",
        birthMonth: 'February'
      },
      {
        name: "John Smith",
        address: "415 East Main Street, Norfolk, Virginia",
        birthMonth: 'October'
      },
      {
        name: "Frank Livingston",
        address: "234 Elm Street, Pittsburgh, Pennsylvania",
        birthMonth: 'March'
      },
      {
        name: "Judy Green",
        address: "2 Apple Boulevard, Cincinatti, Ohio",
        birthMonth: 'December'
      },
      {
        name: "Pat Thomas",
        address: "50 Second Street, New York, New York",
        birthMonth: 'February'
      }
    ];
    this.items = this.allItems;

    this.filterConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          placeholder: 'Filter by Name...',
          filterType: 'text'
        },
        {
          id: 'age',
          title:  'Age',
          placeholder: 'Filter by Age...',
          filterType: 'text'
        },
        {
          id: 'address',
          title:  'Address',
          placeholder: 'Filter by Address...',
          filterType: 'text'
        },
        {
          id: 'birthMonth',
          title:  'Birth Month',
          placeholder: 'Filter by Birth Month...',
          filterType: 'select',
          filterValues: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      ] as FilterField[],
      resultsCount: this.items.length,
      appliedFilters: []
    } as FilterConfig;
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
      this.filtersText += filter.title + " : " + filter.value + "\n";
    });
    this.applyFilters($event.appliedFilters);
  }

  matchesFilter(item: any, filter: Filter): boolean {
    let match = true;

    if (filter.id === 'name') {
      match = item.name.match(filter.value) !== null;
    } else if (filter.id === 'address') {
      match = item.address.match(filter.value) !== null;
    } else if (filter.id === 'birthMonth') {
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
}
