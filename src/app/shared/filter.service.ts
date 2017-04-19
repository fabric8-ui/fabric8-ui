import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Broadcaster } from 'ngx-base';
import { GlobalSettings } from '../shared/globals';

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
    private globalSettings: GlobalSettings,
    private broadcaster: Broadcaster,
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
    // this.broadcaster.broadcast('wi_item_filter', this.filters);
    this.filterChange.next(this.applyFilter);
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
    });
  }

}
