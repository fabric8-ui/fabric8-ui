import { GlobalSettings } from '../shared/globals';

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { FilterModel } from '../models/filter.model';

@Injectable()
export class FilterService {
  public filters: FilterModel[] = [];
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private globalSettings: GlobalSettings
  ) {}

  /**
   * getFilters - Fetches all the available filters
   * @param apiUrl - The url to get list of all filters
   * @return Promise of FilterModel[] - Array of filters
   */
  getFilters(): Promise<FilterModel[]> {
    let apiUrl = [process.env.API_URL, "filters"].join("");

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
