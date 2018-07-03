import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CustomQueryModel } from '../models/custom-query.model';
import { HttpService } from './http-service';

@Injectable()
export class CustomQueryService {
  private customQueries: CustomQueryModel[] = [];

  constructor(
    private http: HttpService
  ) {}

  /**
   * getCustomQueries - Fetches all the available custom queries
   * @param apiUrl - The url to get list of all filters
   * @return Observable of FilterModel[] - Array of filters
   */
  getCustomQueries(apiUrl): Observable<CustomQueryModel[]> {
    return this.http
      .get(apiUrl)
      .map (response => {
        if (/^[5, 4][0-9]/.test(response.status.toString())) {
          throw new Error('API error occured');
        }
        return response.json().data as CustomQueryModel[];
      })
      .map((data) => {
        this.customQueries = data;
        return this.customQueries;
      })
      .catch ((error: Error | any) => {
        if (error.status === 401) {
          console.log('You have been logged out.', error);
        } else {
          console.log('Fetch iteration API returned some error - ', error.message);
        }
        return Observable.throw(new Error(error.message));
      });
  }

  /**
    * Usage: This method create a new item
    * adds the new item to the big list
    * resolve the users for the item
    * re build the ID-Index map
    *
    * @param: WorkItem - workItem (Item to be created)
    */
    create(customQuery: CustomQueryModel,
        apiUrl: string): Observable<CustomQueryModel> {
      let payload = JSON.stringify({data: customQuery});
      return this.http
        .post(apiUrl, payload)
        .map(response => {
          return response.json().data as CustomQueryModel;
        }).catch((error: Error | any) => {
          console.log('Creating custom query failed.', error);
          return Observable.throw(new Error(error.message));
        });
    }

    delete(apiUrl: string) {
      return this.http
        .delete(apiUrl)
        .catch((error: Error | any) => {
          console.log('Delete custom query failed', error);
          return Observable.throw(new Error(error.message));
        });
      }

}
