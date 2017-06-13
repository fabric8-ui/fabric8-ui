import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { cloneDeep } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { WIT_API_URL, Spaces } from 'ngx-fabric8-wit';
import { HttpService } from './http-service';

import { FilterModel } from '../models/filter.model';

@Injectable()
export class FilterService {
  public filters: FilterModel[] = [];
  public activeFilters = [];
  public filterChange = new Subject();
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: HttpService,
    private spaces: Spaces,
    @Inject(WIT_API_URL) private baseApiUrl: string
  ) {}

  setFilterValues(id, value): void {
    let index = this.activeFilters.findIndex(f => f.id === id);
    if (index > -1) {
      this.activeFilters[index].paramKey = 'filter[' + id + ']';
      this.activeFilters[index].value = value;
    } else {
      this.activeFilters.push({
        id: id,
        paramKey: 'filter[' + id + ']',
        value: value
      });
    }
  }

  getFilterValue(id): any {
    const filter = this.activeFilters.find(f => f.id === id);
    return filter ? filter.value : null;
  }

  applyFilter() {
    console.log('[FilterService::applyFilter] - Applying filters', this.activeFilters);
    this.filterChange.next(this.activeFilters);
  }

  getAppliedFilters(): any {
    return this.activeFilters;
  }

  clearFilters(keys: string[] = []): void {
    if (keys.length) {
      this.activeFilters = this.activeFilters.filter(f => keys.indexOf(f.id) === -1)
    } else {
      this.activeFilters = [];
    }
  }


  /**
   * getFilters - Fetches all the available filters
   * @param apiUrl - The url to get list of all filters
   * @return Observable of FilterModel[] - Array of filters
   */
  getFilters(): Observable<FilterModel[]> {
    return this.spaces.current.switchMap(space => {
      if (space) {
        let apiUrl = space.links.filters;
        return this.http
          .get(apiUrl)
          .map(response => {
            return response.json().data as FilterModel[];
          })
          .catch ((error: Error | any) => {
            console.log('API returned error: ', error.message);
            return Observable.throw('Error  - [FilterService - getFilters]' + error.message);
          });
      } else {
        return Observable.of([] as FilterModel[]);
      }
    });
  }

  /**
   * Usage: to check if the workitem matches with current applied filter or not.
   * @param WorkItem - workItem
   * @returns Boolean
   */
  doesMatchCurrentFilter(workItem): Boolean {
    let activeFilters = cloneDeep(this.activeFilters);
    //Remove the parentexists filter
    let index = activeFilters.findIndex(item => {
      return item.paramKey == 'filter[parentexists]'
    })
    if(index > -1 ) {
      activeFilters.splice(index,1);
    }
    //If filters have been applied
    if (activeFilters.length) {
      let matchFilterCount = 0;
      //Loop through active filters
      for (let i = 0; i < activeFilters.length; i++) {
        let filterValue = activeFilters[i].value;
        //Check for a match under each active filter
        var res = Object.keys(workItem.relationships)
          .find((j) =>
            workItem.relationships[j].data ? workItem.relationships[j].data.id === filterValue : false);
        if (res) matchFilterCount++; //If a match is found - increase the count
        else return false; //If no match return false - no need to go through all the filters
      }
      //If all filters match - count needs to be equal to active filter length
      if (matchFilterCount === activeFilters.length) return true;
    } else {
      //No filters have been applied so the new work item can be displayed
      return true;
    }
  }

}
