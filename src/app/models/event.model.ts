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
  modifier:{
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
  newValueResolved: any;
  oldValueResolved: any;
}

export interface EventService extends Event {}

export class EventMapper implements Mapper<EventService, EventUI> {
  constructor () {}

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
    fromPath: ['relationships', 'modifier', 'data'],
    toPath: ['modifier']
  }, {
    fromPath: ['relationships', 'modifier', 'data', 'id'],
    toPath: ['modifierId']
  }, {
    fromPath: ['relationships', 'newValue', 'data'],
    toPath: ['newValueResolved']
  }, {
    fromPath: ['relationships', 'oldValue', 'data'],
    toPath: ['oldValueResolved']
  }];
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
  constructor (private event: EventUI, private state) {
    switch(event.name) {
      case 'system.assignees':
        this.resolve(state.collaborators);
        break;
      
      case 'system.iteration':
        this.resolve(state.iterations);
        break;
      
      case 'system.area':
        this.resolve(state.area);
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
    this.event.newValueResolved = this.event.newValueResolved.map(item => {
      return cloneDeep(data.find(u => u.id === item.id));
    }).filter(item => !!item);
    this.event.oldValueResolved = this.event.oldValueResolved.map(item => {
      return cloneDeep(data.find(u => u.id === item.id));
    }).filter(item => !!item);
  }

}

export class EvenQuery {
  private eventSource = this.store
    .select(state => state.detailPage)
    .select(state => state.events);

  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery
    ) {}

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