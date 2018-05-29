import {
  Mapper,
  MapTree,
  switchModel,
  modelService
} from './common.model';
import { AppState } from './../states/app.state';
import { UserUI, UserQuery } from './user';
import { IterationUI, IterationModel } from './iteration.model';
import { AreaUI, AreaModel } from './area.model';
import { LabelUI, LabelModel } from './label.model';
import { UserService } from 'ngx-login-client';
import { cloneDeep } from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


export class Event extends modelService {
  attributes: EventAttributes;
  relationships: EventRelationships;

}

export class EventAttributes {
  name: string;
  newValue: string | null;
  oldValue: string | null;
  timestamp: string;
}

export class EventRelationships {
  modifier: {
    data: {
      id: string;
      links: {
        related: string;
      }
      type: string;
    }
  }
  newValue?: {
    data?: AreaModel[] | IterationModel[] | UserService[] | LabelModel[];
  }
  oldValue?: {
    data?: AreaModel[] | IterationModel[] | UserService[] | LabelModel[];
  }
}

export interface EventUI {
  name: string;
  timestamp: string;
  newValue: string | null;
  oldValue: string | null;
  modifierId: string;
  modifier?: Observable<UserUI>;
  newValueRelationships: any;
  oldValueRelationships: any;
  type: string | null;
}

export interface EventService extends Event { }

export class EventMapper implements Mapper<EventService, EventUI> {
  constructor() { }

  serviceToUiMapTree: MapTree = [{
    fromPath: ['attributes', 'name'],
    toPath: ['name']
  }, {
    fromPath: ['attributes', 'newValue'],
    toPath: ['newValue']
  }, {
    fromPath: ['attributes', 'oldValue'],
    toPath: ['oldValue']
  }, {
    fromPath: ['attributes', 'timestamp'],
    toPath: ['timestamp']
  }, {
    fromPath: ['relationships', 'modifier', 'data', 'id'],
    toPath: ['modifierId']
  }, {
    fromPath: ['relationships', 'newValue'],
    toPath: ['newValueRelationships'],
    toFunction: (newValue) => {
      if (newValue !== null) {
        if(newValue.hasOwnProperty('data')){
          return newValue["data"]
        }else
          return [];
      } else {
        return newValue
      }
    }
  }, {
    fromPath: ['relationships', 'oldValue'],
    toPath: ['oldValueRelationships'],
    toFunction: (oldValue) => {
        if (oldValue !== null) {
        if(oldValue.hasOwnProperty('data'))
          return oldValue["data"]
        else
          return [];
      } else {
        return oldValue
      }
    }
  }, {
    toPath: ['type'],
    toValue: null
  },];
  uiToServiceMapTree: MapTree;

  toUIModel(arg: EventService): EventUI {
    return switchModel<EventService, EventUI>(
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: EventUI): EventService {
    return switchModel<EventUI, EventService>(
      arg, this.uiToServiceMapTree
    )
  }
}

export class EventResolver {
  constructor(private event: EventUI, private state) {
    switch (event.name) {
      case 'system.assignees':
        this.resolve(state.collaborators);
        break;

      case 'system.iteration':
        this.resolve(state.iterations);
        break;

      case 'system.area':
        this.resolve(state.areas);
        break;

      case 'system.labels':
        this.resolve(state.labels);
        break;

      default:
        break;
    }
  }

  getEvent() {
    return this.event;
  }

  resolve(data) {
    let added = this.event.newValueRelationships.filter(
      newItem => this.event.oldValueRelationships.findIndex(
        oldItem => oldItem.id === newItem.id
      ) === -1
    );

    let removed = this.event.oldValueRelationships.filter(
      oldItem => this.event.newValueRelationships.findIndex(
        newItem => newItem.id === oldItem.id
      ) === -1
    );

    this.event.newValueRelationships = added;
    this.event.oldValueRelationships = removed;
    if (this.event.newValueRelationships.length > 0) {
      this.event.type = this.event.newValueRelationships[0].type;
      this.event.newValueRelationships = this.event.newValueRelationships.map(item => {
        return cloneDeep(data.find(u => u.id === item.id));
      }).filter(item => !!item);
    }
    if (this.event.oldValueRelationships.length > 0) {
      this.event.type = this.event.oldValueRelationships[0].type;
      this.event.oldValueRelationships = this.event.oldValueRelationships.map(item => {
        return cloneDeep(data.find(u => u.id === item.id));
      }).filter(item => !!item);
    }
  }
}

@Injectable()
export class EventQuery {
  private eventSource = this.store
    .select(state => state.detailPage)
    .select(state => state.events);

  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery
  ) { }

  getEventsWithModifier(): Observable<EventUI[]> {
    return this.eventSource
      .map(events => {
        return events.map(event => {
          return {
            ...event,
            modifier: this.userQuery.getUserObservableById(event.modifierId)
          }
        })
      })
  }
}