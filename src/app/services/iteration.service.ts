import { GlobalSettings } from '../shared/globals';

import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { cloneDeep } from 'lodash';
import { Broadcaster, Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { Notification, Notifications, NotificationType } from 'ngx-base';

import { IterationModel, IterationUI } from '../models/iteration.model';
import { MockHttp } from '../mock/mock-http';
import { HttpService } from './http-service';
import { WorkItem } from '../models/work-item';

@Injectable()
export class IterationService {
  public iterations: IterationModel[] = [];
  private transformedIterations = [];
  private headers = new Headers({'Content-Type': 'application/json'});
  private _currentSpace;

  private selfId;

  public dropWIObservable: Subject<{workItem: WorkItem, error: boolean}> = new Subject();
  public createIterationObservable: Subject<IterationModel> = new Subject();

  constructor(
      private logger: Logger,
      private http: HttpService,
      private auth: AuthenticationService,
      private globalSettings: GlobalSettings,
      private broadcaster: Broadcaster,
      private spaces: Spaces,
      private notifications: Notifications
  ) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
    this.selfId = this.createId();
    this.logger.log('Launching IterationService instance id ' + this.selfId);
  }

  notifyError(message: string, httpError: any) {
    this.logger.log('ERROR [IterationService] ' + message + (httpError.message?' '+httpError.message:''));
    /*
    this.notifications.message({
        message: message + (httpError.message?' '+httpError.message:''),
        type: NotificationType.DANGER
      } as Notification);
    */
  }

  createId(): string {
    let id = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log('Created new id ' + id);
    return id;
  }

  /**
   * getIteration - We call this service method to fetch
   * @param iterationUrl - The url to get all the iteration
   * @return Promise of IterationModel[] - Array of iterations.
   */
  getIterations(): Observable<IterationModel[]> {
    if (this.iterations.length > 0 ) {
      return Observable.of(this.iterations);
    } else {
      // get the current iteration url from the space service
      return this.spaces.current.take(1).switchMap(space => {
        let iterationsUrl = space.relationships.iterations.links.related;
        return this.http
          .get(iterationsUrl)
          .map (response => {
            if (/^[5, 4][0-9]/.test(response.status.toString())) {
              throw new Error('API error occured');
            }
            return response.json().data as IterationModel[];
          })
          .map((data) => {
            this.iterations = data.map(iteration => {
              let childIterations = this.checkForChildIterations(iteration, data);
              if(childIterations.length > 0) {
                iteration.hasChildren = true;
                iteration.children = childIterations;
              }
              return iteration;
            });
            return this.iterations;
          })
          .catch ((error: Error | any) => {
            if (error.status === 401) {
              this.notifyError('You have been logged out.', error);
              this.auth.logout();
            } else {
              console.log('Fetch iteration API returned some error - ', error.message);
              this.notifyError('Fetching iterations has from server has failed.', error);
            }
            return Observable.throw(new Error(error.message));
          });
      });
    }
  }

  /**
   * Create new iteration
   * @param iterationUrl - POST url
   * @param iteration - data to create a new iteration
   * @return new item
   */
  createIteration(iteration: IterationModel, parentIteration: IterationModel): Observable<IterationModel> {
    console.log('Create on iteration service.');
    let iterationsUrl;
    delete iteration.id;
    if (parentIteration) {
      iterationsUrl = parentIteration.links.self;
    }
    else {
      iterationsUrl = this._currentSpace.relationships.iterations.links.related;
    }
    if (this._currentSpace) {
      iteration.relationships.space.data.id = this._currentSpace.id;
      return this.http
        .post(
          iterationsUrl,
          { data: iteration }
        )
        .map (response => {
          if (/^[5, 4][0-9]/.test(response.status.toString())) {
            throw new Error('API error occured');
          }
          return response.json().data as IterationModel;
        })
        .map (newData => {
          // Add the newly added iteration on the top of the list
          this.iterations.splice(0, 0, newData);
          return newData;
        })
        .catch ((error: Error | any) => {
          if (error.status === 401) {
            this.notifyError('You have been logged out.', error);
            this.auth.logout();
          } else {
            console.log('Post iteration API returned some error - ', error.message);
            this.notifyError('Creating iteration on server has failed.', error);
            return Observable.throw(new Error(error.message));
          }
        });
    } else {
      return Observable.throw(new Error('error'));
    }
  }

  /**
   * Update an existing iteration
   * @param iteration - Updated iteration
   * @return updated iteration's reference from the list
   */
  updateIteration(iteration: IterationModel): Observable<IterationModel> {
    console.log('Update on iteration service.');
    return this.http
      .patch(iteration.links.self, { data: iteration })
      .map (response => {
        if (/^[5, 4][0-9]/.test(response.status.toString())) {
          throw new Error('API error occured');
        }
        return response.json().data as IterationModel;
      })
      .map (updatedData => {
        // Update existing iteration data
        let index = this.iterations.findIndex(item => item.id === updatedData.id);
        if (index > -1) {
          //set hasChildren and children information
          let childIterations = this.checkForChildIterations(updatedData, this.iterations);
          if(childIterations.length > 0) {
            updatedData.hasChildren = true;
            updatedData.children = childIterations;
          }
          this.iterations[index] = cloneDeep(updatedData);
          return this.iterations[index];

        } else {
          this.iterations.splice(0, 0, updatedData);
          return this.iterations[0];
        }
      })
      .catch ((error: Error | any) => {
        if (error.status === 401) {
          this.notifyError('You have been logged out.', error);
          this.auth.logout();
        } else {
          console.log('Patch iteration API returned some error - ', error.message);
          this.notifyError('Updating iteration on server has failed.', error);
          return Observable.throw(new Error(error.message));
        }
      });
  }

  isRootIteration(parentPath: string): boolean {
    return parentPath === '/';
  }

  getRootIteration(): Observable<IterationModel> {
    return this.getIterations().first()
    .map((resultIterations) => {
      for (let i=0; i<resultIterations.length; i++) {
        if (this.isRootIteration(resultIterations[i].attributes.parent_path))
          return resultIterations[i];
        }
    })
    .catch( err => {
      return Observable.throw(new Error(err.message));
    });
  }

  getIteration(iteration: any): Observable<IterationModel> {
    if (Object.keys(iteration).length) {
      let iterationLink = iteration.data.links.self;
      return this.http.get(iterationLink)
        .map(iterationresp => iterationresp.json().data)
        .catch((error: Error | any) => {
          this.notifyError('Error getting iteration data.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of(undefined);
    }
  }

  getIterationById(iterationId: string): Observable<IterationModel> {
    return this.getIterations().first()
      .map((resultIterations) => {
        for (let i=0; i<resultIterations.length; i++) {
          if (resultIterations[i].id===iterationId) {
            return resultIterations[i];
          }
        }
      })
      .catch( err => {
        return Observable.throw(new Error(err.message));
      });
  }

  getWorkItemCountInIteration(iteration: any): Observable<number> {
    return this.getIteration({ data: iteration }).first().map((resultIteration:IterationModel) => {
      return resultIteration.relationships.workitems.meta.total;
    });
  }

  emitDropWI(workItem: WorkItem, err: boolean = false) {
    this.dropWIObservable.next({workItem: workItem, error: err});
  }

  checkForChildIterations(parent: IterationModel, iterations): IterationModel[] {
    let children = iterations.filter(i => {
      //check only for direct parent
      let path_arr = i.attributes.parent_path.split('/');
      let id = path_arr[path_arr.length-1];
      return (id === parent.id);
    });
    return children;
  }

  checkForChildIterations2(parent: IterationUI, iterations: IterationUI[]): IterationUI[] {
    let children = iterations.filter(i => {
      //check only for direct parent
      let path_arr = i.parentPath.split('/');
      let id = path_arr[path_arr.length-1];
      return (id === parent.id);
    });
    return children;
  }

  getTopLevelIterations(iterations): IterationModel[] {
    let topLevelIterations = iterations.filter(iteration =>
      ((iteration.attributes.parent_path.split('/')).length - 1) === 1
    )
    return topLevelIterations;
  }

  getTopLevelIterations2(iterations: IterationUI[]): IterationUI[] {
    let topLevelIterations = iterations.filter(iteration =>
      ((iteration.parentPath.split('/')).length - 1) === 1
    )
    return topLevelIterations;
  }

  isTopLevelIteration(iteration): Boolean {
    return ((iteration.attributes.parent_path.split('/')).length - 1) === 1;
  }

  getDirectParent(iteration, iterations): IterationModel {
    let path_arr = iteration.attributes.parent_path.split('/');
    let id = path_arr[path_arr.length-1];
    return iterations.find(i => i.id === id);
  }

  emitCreateIteration(iteration: IterationModel) {
    this.createIterationObservable.next(iteration);
  }

  resetIterations() {
    //Hack on destroy empty iterations array
    this.iterations = [];
  }
}
