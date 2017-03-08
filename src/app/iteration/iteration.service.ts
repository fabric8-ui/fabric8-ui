import { GlobalSettings } from '../shared/globals';

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { cloneDeep } from 'lodash';
import {
  AuthenticationService,
  Broadcaster,
  Logger
} from 'ngx-login-client';

import { Space, Spaces } from 'ngx-fabric8-wit';
import { IterationModel } from '../models/iteration.model';
import { MockHttp } from '../shared/mock-http';

@Injectable()
export class IterationService {
  public iterations: IterationModel[] = [];
  private headers = new Headers({'Content-Type': 'application/json'});
  private _currentSpace;

  constructor(
      private logger: Logger,
      private http: Http,
      private auth: AuthenticationService,
      private globalSettings: GlobalSettings,
      private broadcaster: Broadcaster,
      private spaces: Spaces
  ) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
     }
  }

  /**
   * getIteration - We call this service method to fetch
   * @param iterationUrl - The url to get all the iteration
   * @return Promise of IterationModel[] - Array of iterations
   */
  getIterations(): Promise<IterationModel[]> {
    // get the current iteration url from the space service
    if (this._currentSpace) {
      let iterationsUrl = this._currentSpace.relationships.iterations.links.related;
      if (this.checkValidIterationUrl(iterationsUrl)) {
        return this.http
          .get(iterationsUrl, { headers: this.headers })
          .toPromise()
          .then (response => {
            if (/^[5, 4][0-9]/.test(response.status.toString())) {
              throw new Error('API error occured');
            }
            return response.json().data as IterationModel[];
          })
          .then((data) => {
            this.iterations = data;
            return this.iterations;
          })
          .catch ((error: Error | any) => {
            if (error.status === 401) {
              this.auth.logout();
            } else {
              console.log('Fetch iteration API returned some error - ', error.message);
              return Promise.reject<IterationModel[]>([] as IterationModel[]);
            }
          });
      } else {
        this.logger.log('URL not matched');
        return Promise.reject<IterationModel[]>([] as IterationModel[]);
      }
    } else {
      return Promise.resolve<IterationModel[]>([] as IterationModel[]);
    }
  }

  /**
   * Create new iteration
   * @param iterationUrl - POST url
   * @param iteration - data to create a new iteration
   * @return new item
   */
  createIteration(iteration: IterationModel): Promise<IterationModel> {
    if (this._currentSpace) {
      let iterationsUrl = this._currentSpace.relationships.iterations.links.related;
      if (this.checkValidIterationUrl(iterationsUrl)) {
        iteration.relationships.space.data.id = this._currentSpace.id;
        return this.http
          .post(
            iterationsUrl,
            { data: iteration },
            { headers: this.headers }
          )
          .toPromise()
          .then (response => {
            if (/^[5, 4][0-9]/.test(response.status.toString())) {
              throw new Error('API error occured');
            }
            return response.json().data as IterationModel;
          })
          .then (newData => {
            // Add the newly added iteration on the top of the list
            this.iterations.splice(0, 0, newData);
            return newData;
          })
          .catch ((error: Error | any) => {
            if (error.status === 401) {
              this.auth.logout();
            } else {
              console.log('Post iteration API returned some error - ', error.message);
              return Promise.reject<IterationModel>({} as IterationModel);
            }
          });
      } else {
        this.logger.log('URL not matched');
        return Promise.reject<IterationModel>( {} as IterationModel );
      }
    } else {
      return Promise.resolve<IterationModel>( {} as IterationModel );
    }
  }

  /**
   * Update an existing iteration
   * @param iteration - Updated iteration
   * @return updated iteration's reference from the list
   */
  updateIteration(iteration: IterationModel): Promise<IterationModel> {
    return this.http
      .patch(iteration.links.self, { data: iteration }, { headers: this.headers })
      .toPromise()
      .then (response => {
        if (/^[5, 4][0-9]/.test(response.status.toString())) {
          throw new Error('API error occured');
        }
        return response.json().data as IterationModel;
      })
      .then (updatedData => {
        // Update existing iteration data
        let index = this.iterations.findIndex(item => item.id === updatedData.id);
        if (index > -1) {
          this.iterations[index] = cloneDeep(updatedData);
          return this.iterations[index];
        } else {
          this.iterations.splice(0, 0, updatedData);
          return this.iterations[0];
        }
      })
      .catch ((error: Error | any) => {
        if (error.status === 401) {
          this.auth.logout();
        } else {
          console.log('Patch iteration API returned some error - ', error.message);
          return Promise.reject<IterationModel>({} as IterationModel);
        }
      });
  }

  /**
   * checkValidIterationUrl checks if the API url for
   * iterations is valid or not
   * sample url -
   * http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations
   *
   * @param URL
   * @return Boolean
   */
  checkValidIterationUrl(url: string): Boolean {
    let urlArr: string[] = url.split('/');
    let uuidRegExpPattern = new RegExp('[^/]+');
    return (
      urlArr[urlArr.length - 1] === 'iterations' &&
      uuidRegExpPattern.test(urlArr[urlArr.length - 2]) &&
      urlArr[urlArr.length - 3] === 'spaces'
    );
  }

}
