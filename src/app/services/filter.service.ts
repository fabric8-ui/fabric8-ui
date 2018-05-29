import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { cloneDeep } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { WIT_API_URL, Spaces } from 'ngx-fabric8-wit';
import { HttpService } from './http-service';
import { WorkItem } from './../models/work-item';

import { FilterModel } from '../models/filter.model';

@Injectable()
export class FilterService {
  public filters: FilterModel[] = [];
  public activeFilters = [];
  public filterChange = new Subject();
  public filterObservable: Subject<any> = new Subject();
  private headers = new Headers({'Content-Type': 'application/json'});

  public and_notation = '$AND';
  public or_notation = '$OR';
  public equal_notation = '$EQ';
  public not_equal_notation = '$NE';
  public in_notation = '$IN';
  public not_in_notation = '$NIN';
  public sub_str_notation = '$SUBSTR'

  public special_keys = {
    'null': null,
    'true': true,
    'false': false,
    '': null
  }

  private compare_notations: string[] = [
    this.equal_notation,
    this.not_equal_notation,
    this.in_notation,
    this.not_in_notation,
    this.sub_str_notation
  ];

  private join_notations: string[] = [
    this.and_notation,
    this.or_notation,
  ];

  private filtertoWorkItemMap = {
    'assignee': ['relationships', 'assignees', 'data', ['id']],
    'creator': ['relationships', 'creator', 'data', 'id'],
    'area': ['relationships', 'area', 'data', 'id'],
    'workitemtype': ['relationships', 'baseType', 'data', 'id'],
    'iteration': ['relationships', 'iteration', 'data', 'id'],
    'state': ['attributes','system.state'],
  }

  constructor(
    private http: HttpService,
    private spaces: Spaces,
    private route: ActivatedRoute,
    @Inject(WIT_API_URL) private baseApiUrl: string
  ) {}

  setFilterValues(id, value): void {
    let index = this.activeFilters.findIndex(f => f.id === id);
    if (index > -1 && value !== undefined) {
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

  getAppliedFilters(includeSidePanel: boolean = false): any {
    if (includeSidePanel) {
      let arr = this.getFiltersFromUrl();
      arr = arr.concat(this.activeFilters);
      //remove duplicates
      arr = arr
      .filter((thing, index, self) => self.findIndex((t) => {return t.id === thing.id }) === index)
      return arr;
    } else {
      return this.activeFilters;
    }
  }

  getFiltersFromUrl(): any {
    // TODO
    // This code needs to be looked at
    // to support in query from the expression as well
    let refCurrentFilter = [];
    if(this.route.snapshot.queryParams['q']) {
      let urlString = this.route.snapshot.queryParams['q']
      .replace(' $AND ',' ')
      .replace(' $OR ',' ')
      .replace('(','')
      .replace(')','')
      let temp_arr = urlString.split(' ');
      for(let i = 0; i < temp_arr.length; i++) {
        let arr = temp_arr[i].split(':')
        if (arr[1] !== undefined ) {
          refCurrentFilter.push({
            id: arr[0],
            paramKey: 'filter[' + arr[0] + ']',
            value: arr[1]
          })
        }
      };
    }
    //active filter will have the transient filters
    //witgroup and space are permanent filters
    return refCurrentFilter.filter(f => f.id === 'typegroup.name' || f.id === 'space' || f.id === 'iteration');
  }

  clearFilters(keys: string[] = []): void {
    if (keys.length) {
      this.activeFilters = this.activeFilters.filter(f => keys.indexOf(f.id) > -1)
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
   * getFilters - Fetches all the available filters
   * @param apiUrl - The url to get list of all filters
   * @return Observable of FilterModel[] - Array of filters
   */
  getFilters2(apiUrl): Observable<FilterModel[]> {
    return this.http
      .get(apiUrl)
      .map(response => {
        return response.json().data as FilterModel[];
      })
      .catch ((error: Error | any) => {
        console.log('API returned error: ', error.message);
        return Observable.throw('Error  - [FilterService - getFilters]' + error.message);
      });
  }

  returnFilters() {
      return this.filters
  }

  /**
   * Usage: to check if the workitem matches with current applied filter or not.
   * TODO: Make this function better and smarter
   * NOTE: To add a new filter you have to do nothing here, just update the filtertoWorkItemMap
   * @param WorkItem - workItem
   * @returns boolean
   */
  doesMatchCurrentFilter(workItem: WorkItem): boolean {
    let refCurrentFilter = this.getFiltersFromUrl();
    //concat both arrays
    refCurrentFilter = refCurrentFilter.concat(this.activeFilters);
    //remove duplicates
    refCurrentFilter = refCurrentFilter
    .filter((thing, index, self) => self.findIndex((t) => {return t.id === thing.id }) === index)
    return refCurrentFilter.every(filter => {
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
      processedObject = '(' + Object.keys(options).map(key => {
        return typeof(options[key]) !== 'string' ? key + ':' + options[key] :
          options[key].split(',').map(val => {
            return key + ':' + val;
          }).join(' ' + this.and_notation + ' ')
      }).join(' ' + this.and_notation + ' ') + ')';
    } else if (Object.keys(options).length === 1) {
      processedObject = Object.keys(options).map(key => {
        return typeof(options[key]) !== 'string' ? key + ':' + options[key] :
          options[key].split(',').map(val => {
            return key + ':' + val;
          }).join(' ' + this.and_notation + ' ')
      }).join(' ' + this.and_notation + ' ');
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
   *
   * @param key The value is the object key like 'workitem_type', 'iteration' etc
   * @param compare The values are
   *                FilterService::equal_notation',
   *                FilterService::not_equal_notation',
   *                FilterService::not_equal_notation',
   *                FilterService::in_notation',
   *                FilterService::not_in_notation'
   * @param value string or array of string of values (in case of IN or NOT IN)
   */
  queryBuilder(key: string, compare: string, value: string | string[]): any {
    if (this.compare_notations.indexOf(compare.trim()) == -1) {
      throw new Error('Not a valid compare notation');
    }
    let op = {}; op[key.trim()] = {};
    if (Array.isArray(value)) {
      op[key.trim()][compare.trim()] = value.map(v => v.trim());
    } else {
      op[key.trim()][compare.trim()] = value === null ? null : value.trim();
    }
    return op;
  }

  /**
   *
   * @param existingQueryObject
   * @param join The values are
   *                FilterService::and_notation,
   *                FilterService::or_notation
   * @param newQueryObject
   */
  queryJoiner(existingQueryObject: object, join: string, newQueryObject: object): any {
    if (this.join_notations.indexOf(join.trim()) == -1) {
      throw new Error('Not a valid compare notation');
    }
    // existingQueryObject is empty
    if (!Object.keys(existingQueryObject).length) {
      if (Object.keys(newQueryObject).length) {
        if (this.join_notations.indexOf(Object.keys(newQueryObject)[0]) > -1) {
          return newQueryObject;
        } else {
          let op = {};
          op[this.or_notation] = [newQueryObject];
          return op;
        }
      } else {
        return {};
      }
    } else {
			// If existingObject is not empty
			let existingJoiner = Object.keys(existingQueryObject)[0];
			// If existing joiner is not valid
			if (this.join_notations.indexOf(existingJoiner) == -1) {
				throw new Error('Existing query object is invalid without a joiner in root');
			}
			// If new object is empty then return existingQueryObject
			if (!Object.keys(newQueryObject).length) {
				return existingQueryObject;
			}
			let newJoiner = Object.keys(newQueryObject)[0];
			// If new object has join_notation as root
      if (this.join_notations.indexOf(newJoiner) > -1) {
				// If new joiner existing joiner and given joiner is same
				// put all of them under one joiner
				if (join === newJoiner && join === existingJoiner) {
					let op = {};
					op[join] = [
						...existingQueryObject[join],
						...newQueryObject[join]
					]
					return op;
        }
        // If both the objects have one element each
        // Then given joiner gets priority
        else if (existingQueryObject[existingJoiner].length === 1 &&
          newQueryObject[newJoiner].length === 1) {
            let op = {};
            op[join] = [
              ...existingQueryObject[existingJoiner],
              ...newQueryObject[newJoiner]
            ]
            return op;
        }
        // If existing query has only one element
        // then newJoiner gets the priority
        else if (existingQueryObject[existingJoiner].length === 1) {
          let op = {};
          if (newJoiner === join) {
            op[join] = [
              ...existingQueryObject[existingJoiner],
              ...newQueryObject[newJoiner]
            ]
          } else {
            op[join] = [
              ...existingQueryObject[existingJoiner],
              newQueryObject
            ]
          }
          return op;
        }
        // If new query has only one element
        // then existingJoiner gets the priority
        else if (newQueryObject[newJoiner].length === 1) {
          let op = {};
          if (existingJoiner === join) {
            op[join] = [
              ...existingQueryObject[existingJoiner],
              ...newQueryObject[newJoiner]
            ]
          } else {
            op[join] = [
              existingQueryObject,
              ...newQueryObject[newJoiner]
            ]
          }
          return op;
        }
        else {
					let op = {};
					op[join] = [
						existingQueryObject,
						newQueryObject
					];
					return op;
				}
			} else {
				if (join === existingJoiner) {
					existingQueryObject[join].push(newQueryObject);
					return existingQueryObject;
				} else {
          let op = {};
          // If existingQueryObject has only one item in the array
          if (existingQueryObject[existingJoiner].length === 1) {
            op[join] = [
              ...existingQueryObject[existingJoiner],
              newQueryObject
            ];
          } else {
            op[join] = [
              existingQueryObject,
              newQueryObject
            ];
          }
					return op;
				}
			}
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
        let val_arr = value.split(',').map(i => i.trim());
        dObj[key] = {};
        if (splitter === '!') {
          if (val_arr.length > 1) {
            dObj[key][this.not_in_notation] = val_arr;
          } else {
            if (Object.keys(this.special_keys).findIndex(k => k === val_arr[0]) > -1) {
              dObj[key][this.not_equal_notation] = this.special_keys[val_arr[0]];
            }
            else if(key === 'title') {
              dObj[key][this.sub_str_notation] = val_arr[0];
            }
            else {
              dObj[key][this.not_equal_notation] = val_arr[0];
            }
          }
        } else if(splitter === ':') {
          if (val_arr.length > 1) {
            dObj[key][this.in_notation] = val_arr;
          } else {
            if (Object.keys(this.special_keys).findIndex(k => k === val_arr[0]) > -1 ) {
              dObj[key][this.equal_notation] = this.special_keys[val_arr[0]];
            }
            else if(key === 'title') {
              dObj[key][this.sub_str_notation] = val_arr[0];
            }
            else {
              dObj[key][this.equal_notation] = val_arr[0];
            }
          }
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
      if (Object.keys(item)[0] == this.and_notation || Object.keys(item)[0] == this.or_notation) {
        return this.jsonToQuery(item);
      } else {
        let data_key = Object.keys(item)[0];
        let data = item[data_key];
        let conditional_operator = Object.keys(data)[0];
        let splitter: string = '';

        switch (conditional_operator) {
          case this.equal_notation:
            splitter = ':';
            return data_key + splitter + data[conditional_operator];
          case this.not_equal_notation:
            splitter = '!';
            return data_key + splitter + data[conditional_operator];
          case this.in_notation:
            splitter = ':';
            return data_key + splitter + data[conditional_operator].join();
          case this.not_in_notation:
            splitter = '!';
            return data_key + splitter + data[conditional_operator].join();
          case this.sub_str_notation:
            splitter = ':'
            return data_key + splitter + data[conditional_operator];
        }
      }
    })
    .join(' ' + key + ' ') + ')';
  }

  /**
   * This decodes a key query term value from a given query string. It is used to
   * shortcut the parsing of the query string to get context info from it. Currently,
   * it is used when getting the context info from an existing query to give context
   * to a following UX flow. This only supports a very narrow usecase currently, but
   * may be extended later.
   *
   * @param queryString search/filter query string.
   * @param key key of the term for which we look for the value.
   */
  getConditionFromQuery(queryString: string, key: string): string {
    if (queryString) {
      let decodedQuery = this.queryToJson(queryString);
      // we ignore non-AND queries for now, might want to extend that later.
      if (!decodedQuery['$AND']) {
        console.log('The current query is not supported by getConditionFromQuery() (non-AND query): ' + queryString);
        return undefined;
      } else {
        let terms: any[] = decodedQuery['$AND'];
        if (terms || !Array.isArray(terms)) {
          for (let i=0; i<terms.length; i++) {
            let thisTerm = terms[i];
            if (thisTerm && thisTerm[key]) {
              // format of value: {$EQ: "value"}, if not found, value remains undefined
              return thisTerm[key]['$EQ'];
            }
          }
          console.log('Condition key not found in query: ' + key + ', query= ' + queryString);
          return undefined;
        } else {
          console.log('The current query is not supported by getConditionFromQuery() (bad format): ' + queryString);
          // use standard non-context create dialog
          return undefined;
        }
      }
    }
  }

  // Temporary function to deal with single level $AND operator
  queryToFlat(query: string) {
    return query.replace(/^\((.+)\)$/,"$1")
      .split(this.and_notation).map((item, index) => {
        // regex to match field:value pattern.
        // for item=title:A:D, field -> title and value -> A:D
        let filterValue = /(^[^:]+):(.*)$/.exec(item);
      return {
        field: filterValue[1].trim(),
        index: index,
        value: filterValue[2].trim()
      }
    })
  }

  flatToQuery(arr: any[]) {
    let query = {};
    arr.forEach(item => {
      const newQuery = this.queryBuilder(
        item.field,
        this.equal_notation,
        item.value
      );
      query = this.queryJoiner(
        query,
        this.and_notation,
        newQuery
      );
    })
    return query;
  }
}
