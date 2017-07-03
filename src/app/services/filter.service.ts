import { WorkItem } from './../models/work-item';
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
  public filterObservable: Subject<any> = new Subject();
  private headers = new Headers({'Content-Type': 'application/json'});

  private filtertoWorkItemMap = {
    'assignee': ['relationships', 'assignees', 'data', ['id']],
    'area': ['relationships', 'area', 'data', 'id'],
    'workitemtype': ['relationships', 'baseType', 'data', 'id'],
    'iteration': ['relationships', 'iteration', 'data', 'id']
  }

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
    //Emit filter update event
    this.filterObservable.next();
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
   * TODO: Make this function better and smarter
   * NOTE: To add a new filter you have to do nothing here, just update the filtertoWorkItemMap
   * @param WorkItem - workItem
   * @returns boolean
   */
  doesMatchCurrentFilter(workItem: WorkItem): boolean {
    return this.activeFilters.every(filter => {
      if (filter.id && Object.keys(this.filtertoWorkItemMap).indexOf(filter.id) > -1) {
        let currentAttr = workItem;
        return this.filtertoWorkItemMap[filter.id].every((attr, map_index) => {
          if (Array.isArray(attr)) {
            if (Array.isArray(currentAttr)) {
              let innerAttr = currentAttr;
              return currentAttr.some(item => {
                return item[attr[0]] == filter.value;
              })
            } else {
              return false;
            }
          }
          else if (currentAttr[attr]) {
            currentAttr = currentAttr[attr];
            if (map_index === this.filtertoWorkItemMap[filter.id].length - 1 && currentAttr != filter.value) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        });
      }
      return true;
    })
  }

}
