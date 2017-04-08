import { Observable } from 'rxjs/Observable';
import { Broadcaster } from 'ngx-base';
import { GlobalSettings } from '../shared/globals';

import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { WIT_API_URL } from 'ngx-fabric8-wit';

import { FilterModel } from '../models/filter.model';

@Injectable()
export class FilterService {
  public filters: FilterModel[] = [];
  public activeFilters = [];
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private globalSettings: GlobalSettings,
    private broadcaster: Broadcaster,
    @Inject(WIT_API_URL) private baseApiUrl: string
  ) {}

  setFilterValues(id, value): void {
    this.activeFilters.push({
        paramKey: 'filter[' + id + ']',
        value: value
    });
  }

  applyFilter() {
    console.log('[FilterService::applyFilter] - Applying filters', this.activeFilters);
    this.broadcaster.broadcast('wi_item_filter', this.filters);
  }

  getAppliedFilters(): any {
    return this.activeFilters;
  }

  clearFilters(): void {
    this.activeFilters = [];
  }


  /**
   * getFilters - Fetches all the available filters
   * @param apiUrl - The url to get list of all filters
   * @return Promise of FilterModel[] - Array of filters
   */
  getFilters(): Promise<FilterModel[]> {
    let apiUrl = [this.baseApiUrl, 'filters'].join('');

    return this.http
    .get(apiUrl)
    .toPromise()
    .then (response => {
      return response.json().data as FilterModel[];
    })
    .catch ((error: Error | any) => {
      console.log('API returned error: ', error.message);
      return Promise.reject<FilterModel>({} as FilterModel);
    });
  }

}
