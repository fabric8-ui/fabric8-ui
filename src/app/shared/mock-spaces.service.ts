import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SpaceMockGenerator } from './mock-data/space-mock-generator';

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { cloneDeep } from 'lodash';

import { Logger } from './logger.service';
import { MockDataService } from './mock-data.service';
import { User } from '../models/user';

@Injectable()
export class SpaceService {

  private currentSpaceSubjectSource: BehaviorSubject<Space> = null;
  private currentSpaceBus: Observable<Space> = null;

  private spaces: Space[] = [];
  private currentSpace: Space = null;

  constructor(private http: Http, private mockDataService: MockDataService, private logger: Logger) {
    logger.log('Mock SpaceService running.');
    
    // init mock data and broadcaster
    // TODO: evaluate if the local broadcaster or a global broadcaster (like in Broadcaster service class) makes sense.
    this.spaces = this.createSpacesFromServiceResponse(mockDataService.getAllSpaces());
    this.currentSpaceSubjectSource = new BehaviorSubject<Space>(this.spaces[0]);
    this.currentSpaceBus = this.currentSpaceSubjectSource.asObservable();
  }

  private switchToSpace(newSpace: Space) {
    this.currentSpaceSubjectSource.next(newSpace);
  }

  getCurrentSpaceBus(): Observable<Space> {
    return this.currentSpaceBus;
  }

  getCurrentSpace(): Promise<Space> {
    return Observable.of(this.currentSpace).toPromise();
  }

  getAllSpaces(): Promise<Space[]> {
    return Observable.of(this.spaces).toPromise();
  }

  private createSpacesFromServiceResponse(response: any): Space[] {
    var result: Space[] = [];
    for (var i = 0; i < response.length; i++) {
      var thisElem = response[i];
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
        iterationsUrl: thisElem.relationships.iterations.links.related;
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
