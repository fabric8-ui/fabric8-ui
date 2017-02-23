import { Observer } from 'rxjs/Observer';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { cloneDeep } from 'lodash';
import {
  Logger,
  User
} from 'ngx-login-client';

import { MockDataService } from './mock-data.service';
import { SpaceMockGenerator } from './mock-data/space-mock-generator';
import { MockHttp } from './mock-http';
import { GlobalSettings } from './globals';

@Injectable()
export class SpaceService {

  private currentSpaceSubjectSource: BehaviorSubject<Space> = null;
  private currentSpaceBus: Observable<Space> = null;

  private spaces: Space[] = [];
  private currentSpace: Space = null;

  constructor(
    private http: Http,
    private mockDataService: MockDataService,
    private logger: Logger,
    private globalSettings: GlobalSettings
  ) {
    this.globalSettings.inTestMode$.subscribe(mode => mode = testMode);
    if (testMode) {
  }

  public switchToSpace(newSpace: Space) {
    this.currentSpace = newSpace;
    this.currentSpaceSubjectSource.next(newSpace);
  }

  private initSpaces() {
    if (!this.currentSpace) {
      this.currentSpace = this.spaces[0];
      this.currentSpaceSubjectSource = new BehaviorSubject<Space>(this.spaces[0]);
      this.currentSpaceBus = this.currentSpaceSubjectSource.asObservable();
    }
  }

  getCurrentSpaceBus(): Observable<Space> {
    return this.currentSpaceBus;
  }

  getCurrentSpace(): Promise<Space> {
    if (this.currentSpace) {
      return Observable.of(this.currentSpace).toPromise();
    } else {
      let observable = Observable.create((observer: Observer<Space>) => {
        this.getAllSpaces().then((spaces: Space[]) => {
          observer.next(this.currentSpace);
          observer.complete();
        });
      });
      return observable.toPromise();
    }
  }

  getAllSpaces(): Promise<Space[]> {
    if (Globals.inTestMode) {
      this.logger.log('SpaceService running in ' + process.env.ENV + ' mode.');
      this.spaces = this.createSpacesFromServiceResponse(this.mockDataService.getAllSpaces());
      this.initSpaces();
      this.logger.log('Initialized spaces from inmemory.');
      return Observable.of(this.spaces).toPromise();
    } else {
      this.logger.log('SpaceService running in production mode.');
      // TODO:  this is the base URL slightly to be changed
      let url = process.env.API_URL + 'spaces';    
      let observable = Observable.create((observer: Observer<Space[]>) => {
        this.http.get(url)
        .toPromise()
        .then((spaces: any) => {
          this.spaces = this.createSpacesFromServiceResponse(spaces.json().data);
          this.initSpaces();
          this.logger.log('Initialized spaces from server.');
          observer.next(this.spaces);
          observer.complete();
        });
      });
      return observable.toPromise();
    }
  }

  private createSpacesFromServiceResponse(response: any): Space[] {
    let result: Space[] = [];
    for (let i = 0; i < response.length; i++) {
      let thisElem = response[i];
      let thisTeam: Team = {
        name: 'Team ' + thisElem.attributes.name,
        members: [ this.mockDataService.getUser() ]
      } as Team;
      let thisSpace: Space = {
        name: thisElem.attributes.name,
        path: '',
        description: '',
        teams: [ thisTeam ],
        defaultTeam: thisTeam,
        process: new ProcessTemplate(),
        privateSpace: false,
        id: thisElem.id,
        attributes: new SpaceAttributes(),
        type: thisElem.type,
        iterationsUrl: thisElem.relationships.iterations.links.related,
        spaceBaseUrl: process.env.API_URL
      } as Space;
      result.push(thisSpace);
    }
    return result;
  }

  private handleError(error: any): Promise<any> {
    this.logger.error(error);
    return Promise.reject(error.message || error);
  }
}

// models

export interface Space {
    name: string;
    path: String;
    description: String;
    process?: ProcessTemplate;
    privateSpace?: boolean;
    teams: Team[];
    defaultTeam: Team;
    id: string;
    attributes: SpaceAttributes;
    type: string;
    iterationsUrl: string
    spaceBaseUrl: string
}

export class ProcessTemplate {
    name: string;
}

export interface Team {
    name: string;
    members: User[];
}

export class SpaceAttributes {
    name: string;
    'updated-at': string;
    'created-at': string;
    version: number;
}
