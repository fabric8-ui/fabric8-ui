import { CardValue } from './../components/card/card.component';
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

  private and_notation = '$AND';
  private or_notation = '$OR';
  private equal_notation = '$EQ';
  private not_equal_notation = '$NEQ';

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


  /**
   * Take the existing query and simply AND it with provided options
   * @param existingQuery
   * @param options
   */
  constructQueryURL(existingQuery: string, options: Object): string {
    let processedObject = '';
    // If onptions has any length enclose processedObject with ()
    if (Object.keys(options).length > 1) {
      processedObject = '(' + Object.keys(options).map(key => key + ':' + options[key]).join(' ' + this.and_notation + ' ') + ')';
    } else if (Object.keys(options).length === 1) {
      processedObject = Object.keys(options).map(key => key + ':' + options[key]).join(' ' + this.and_notation + ' ');
    }
    // else return existingQuery
    else {
      return decodeURIComponent(existingQuery);
    }

    // Check if the existing query is empty
    // Then return processedObject
    if (existingQuery === '') {
      return processedObject;
    } else {
      // Decode existing URL
      let decodedURL = decodeURIComponent(existingQuery);

      // Check if there is any composite query in existing one
      if (decodedURL.indexOf(this.and_notation) > -1 || decodedURL.indexOf(this.or_notation) > -1) {
        // Check if existing query is a group i.e. enclosed
        if (decodedURL[0] != '(' || decodedURL[decodedURL.length - 1] != ')') {
          // enclose it with ()
          decodedURL = '(' + decodedURL + ')';
        }
      }

      // Add the query from option with AND operation
      return '(' + decodedURL + ' ' + this.and_notation + ' ' + processedObject + ')';
    }
  }


  /**
   * Query string to JSON conversion
   */
  queryToJson(query: string, first_level: boolean = true): any {
    let temp = [], p_count = 0, p_start = -1, new_str = '', output = {};
    for(let i = 0; i < query.length; i++) {
      if (query[i] === '(') {
        if (p_start < 0) p_start = i;
        p_count += 1;
      }
      if (p_start === -1) {
        new_str += query[i];
      }
      if (query[i] === ')') {
        p_count -= 1;
      }
      if (p_start >= 0 && p_count === 0) {
        temp.push(query.substring(p_start + 1, i));
        new_str += '__temp__';
        p_start = -1;
      }
    }
    temp.reverse();
    let arr = new_str.split(this.or_notation);
    if (arr.length > 1) {
      output[this.or_notation] = arr.map(item => {
        item = item.trim();
        if (item == '__temp__') {
          item = temp.pop();
        }
        while (item.indexOf('__temp__') > -1) {
          item = item.replace('__temp__', temp.pop());
        }
        return this.queryToJson(item, false);
      })
    } else {
      arr = new_str.split(this.and_notation);
      if (arr.length > 1) {
        output[this.and_notation] = arr.map(item => {
          if (item.trim() == '__temp__') {
            item = temp.pop();
          }
          return this.queryToJson(item, false);
        })
      } else {
        let dObj = {};
        while (new_str.indexOf('__temp__') > -1) {
          new_str = new_str.replace('__temp__', temp.pop());
        }
        if (new_str.indexOf(this.and_notation) > -1 || new_str.indexOf(this.or_notation) > -1) {
          return this.queryToJson(new_str, false);
        }

        let keyIndex = -1;
        let splitter = '';
        for (let i = 0; i < new_str.length; i ++) {
          if (new_str[i] === ':' || new_str[i] === '!') {
            splitter = new_str[i];
            keyIndex = i;
            break;
          }
        }

        let key = new_str.substring(0, keyIndex).trim();
        let value = new_str.substring(keyIndex + 1).trim();
        if (splitter === '!') {
          dObj[this.not_equal_notation] = {};
          dObj[this.not_equal_notation][key] = value;
        } else {
          dObj[this.equal_notation] = {};
          dObj[this.equal_notation][key] = value;
        }
        if (first_level) {
          output[this.or_notation] = [dObj];
        } else {
          return dObj;
        }
      }
    }
    return output;
  }


  jsonToQuery(obj: object): string {
    let key = Object.keys(obj)[0]; // key will be AND or OR
    let value = obj[key];

    return '(' + value.map(item => {
      let splitter = ':';
      if (Object.keys(item)[0] == this.and_notation || Object.keys(item)[0] == this.or_notation) {
        return this.jsonToQuery(item);
      } else {
        let conditional_operator = Object.keys(item)[0];
        splitter = conditional_operator === this.not_equal_notation ? '!' : ':';

        let data = item[conditional_operator];
        let data_key = Object.keys(data)[0];
        return data_key + splitter + data[data_key];
      }
    })
    .join(' ' + key + ' ') + ')';
  }
}
