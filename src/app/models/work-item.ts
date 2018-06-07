import { AppState, ListPage } from './../states/app.state';
import { Observable } from 'rxjs';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import {
  WorkItemType,
  WorkItemTypeUI,
  WorkItemTypeMapper
} from './work-item-type';
import {
  AreaModel, AreaUI, AreaMapper,
  AreaService, AreaQuery
} from './area.model';
import { Comments, Comment, CommentUI, CommentMapper } from './comment';
import { Link } from './link';
import {
  IterationModel, IterationUI,
  IterationMapper, IterationService,
  IterationQuery
} from './iteration.model';
import {
   LabelModel, LabelUI, LabelMapper,
   LabelService, LabelQuery
} from './label.model';
import { UserUI, UserMapper, UserService, UserQuery } from './user';
import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel,
  cleanObject,
  CommonSelectorUI
} from './common.model';
//import {IterationQuery} from './iteration.model';

export class WorkItem extends modelService {
  hasChildren?: boolean;
  attributes: object = {};
  number?: number;
  relationships?: WorkItemRelations;
  relationalData?: RelationalData;
  links?: {
    self: string;
  };
}

export class WorkItemRelations {
  area?: {
    data?: AreaModel
  };
  assignees?: {
    data?: UserService[]
  };
  labels?: {
    data?: LabelModel[];
    links?: {
      related?: string;
    }
  };
  baseType?: {
    data: WorkItemType;
  };
  parent?: {
    data?: WorkItem;
  };
  children?: {
    links: {
      related: string;
    };
    meta: {
      hasChildren: boolean;
    };
  };
  events?: {
    links?: {
      related?: string;
    }
  };
  comments?: {
    data?: Comment[];
    links: {
      self?: string;
      related?: string;
    };
    meta?: {
      totalCount?: number;
    }
  };
  creator?: {
    data: UserService;
  };
  iteration?: {
    data?: IterationModel;
  };
  codebase?: {
    links: {
      meta: {
        edit: string;
      }
    }
  };
  workItemLinks?: {
    links?: {
      related?: string;
    }
  }
}

export class RelationalData {
  area?: AreaModel;
  creator?: UserService;
  comments?: Comment[];
  parent?: WorkItem;
  assignees?: UserService[];
  labels?: LabelModel[];
  linkDicts?: LinkDict[];
  iteration?: IterationModel;
  totalLinkCount?: number;
  wiType?: WorkItemType;
}

export class LinkDict {
  linkName: any;
  links: Link[];
  count: number;
}

export interface WorkItemService extends WorkItem {}

export interface WorkItemUI {
  id: string;
  title: string;
  number: string | number;
  createdAt: string;
  updatedAt: string;
  state: string;
  descriptionMarkup: string;
  descriptionRendered: string;
  description: string | {content: string, markup: 'Markdown', rendered?: string};
  version: number;
  order: number;
  dynamicfields?: any;

  areaId: string;
  areaObs?: Observable<AreaUI>;
  iterationId: string;
  iterationObs?: Observable<IterationUI>;
  assignees: string[];
  assigneesObs?: Observable<UserUI[]>;
  creator: string;
  creatorObs?: Observable<UserUI>;
  type: WorkItemTypeUI;
  labels: string[];
  labelsObs: Observable<LabelUI[]>;
  comments?: CommentUI[];
  children?: WorkItemUI[];
  commentLink: string;
  childrenLink: string;
  eventLink: string;
  hasChildren: boolean;
  parentID: string;
  link: string;
  WILinkUrl: string;

  treeStatus: 'collapsed' | 'expanded' | 'disabled' | 'loading'; // collapsed
  childrenLoaded: boolean; // false
  bold: boolean; // false

  createId?: number; // this is used to identify newly created item
  selected: boolean;
}

export interface WorkItemStateModel extends EntityState<WorkItemUI> {}

const workItemAdapter = createEntityAdapter<WorkItemUI>();
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = workItemAdapter.getSelectors();

export class WorkItemMapper implements Mapper<WorkItemService, WorkItemUI> {
  itMapper = new IterationMapper();
  wiTypeMapper = new WorkItemTypeMapper();
  areaMapper = new AreaMapper();
  userMapper = new UserMapper();
  labelMapper = new LabelMapper();

  serviceToUiMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['attributes','system.title'],
      toPath: ['title']
    }, {
      fromPath: ['attributes','system.number'],
      toPath: ['number']
    }, {
      fromPath: ['attributes','system.order'],
      toPath: ['order']
    }, {
      fromPath: ['attributes','system.created_at'],
      toPath: ['createdAt']
    }, {
      fromPath: ['attributes','system.updated_at'],
      toPath: ['updatedAt']
    }, {
      fromPath: ['attributes','system.state'],
      toPath: ['state']
    }, {
      fromPath: ['attributes','system.description.markup'],
      toPath: ['descriptionMarkup']
    }, {
      fromPath: ['attributes','system.description.rendered'],
      toPath: ['descriptionRendered']
    }, {
      fromPath: ['attributes','system.description'],
      toPath: ['description']
    }, {
      fromPath: ['attributes','version'],
      toPath: ['version']
    }, {
      fromPath: ['links','self'],
      toPath: ['link']
    }, {
      fromPath: ['relationships','workItemLinks', 'links', 'related'],
      toPath: ['WILinkUrl']
    }, {
      fromPath: ['relationships','area','data', 'id'],
      toPath: ['areaId'],
    }, {
      fromPath: ['relationships','creator','data', 'id'],
      toPath: ['creator']
    }, {
      fromPath: ['relationships','iteration','data', 'id'],
      toPath: ['iterationId']
    }, {
      fromPath: ['relationships','baseType','data'],
      toPath: ['type'],
      toFunction: this.wiTypeMapper.toUIModel.bind(this.wiTypeMapper)
    }, {
      fromPath: ['relationships','comments','links', 'related'],
      toPath: ['commentLink']
    }, {
      fromPath: ['relationships','events','links', 'related'],
      toPath: ['eventLink']
    }, {
      fromPath: ['relationships','assignees','data'],
      toPath: ['assignees'],
      toFunction: function(assignees: UserService[]) {
        if (!assignees) return [];
        return assignees.map(assignee => assignee.id)
      }
    }, {
      fromPath: ['relationships','labels','data'],
      toPath: ['labels'],
      toFunction: function(labels: LabelModel[]) {
        if (!labels) return [];
        return labels.map(label => label.id)
      }
    }, {
      toPath: ['children'],
      toValue: []
    },{
      fromPath: ['relationships','children', 'meta', 'hasChildren'],
      toPath: ['hasChildren']
    }, {
      fromPath: ['relationships','parent','data','id'],
      toPath: ['parentID']
    }, {
      fromPath: ['relationships','children','links','related'],
      toPath: ['childrenLink']
    }, {
      fromPath: ['relationships','children', 'meta', 'hasChildren'],
      toPath: ['treeStatus'],
      toFunction: (hasChildren) => {
        if (!hasChildren) {
          return 'disabled';
        } else {
          return 'collapsed';
        }
      }
    }, {
      toPath: ['childrenLoaded'],
      toValue: false
    }, {
      toPath: ['bold'],
      toValue: false
    },
  ];

  uiToServiceMapTree: MapTree = [{
      toPath: ['id'],
      fromPath: ['id']
    }, {
      fromPath: ['title'],
      toPath: ['attributes','system.title']
    }, {
      fromPath: ['number'],
      toPath: ['attributes','system.number']
    }, {
      fromPath: ['order'],
      toPath: ['attributes','system.order']
    }, {
      fromPath: ['createdAt'],
      toPath: ['attributes','system.created_at']
    }, {
      fromPath: ['updatedAt'],
      toPath: ['attributes','system.updated_at']
    }, {
      fromPath: ['state'],
      toPath: ['attributes','system.state'],
    }, {
      fromPath: ['descriptionRendered'],
      toPath: ['attributes','system.description.rendered'],
    }, {
      fromPath: ['description'],
      toPath: ['attributes','system.description'],
    }, {
      fromPath: ['description'],
      toPath: ['attributes','system.description.markup'],
      toFunction: (val) => {
        if (val) return 'Markdown';
        return null;
      }
    }, {
      fromPath: ['version'],
      toPath: ['attributes','version']
    }, {
      fromPath: ['link'],
      toPath: ['links','self']
    }, {
      fromPath: ['WILinkUrl'],
      toPath: ['relationships','workItemLinks', 'links', 'related']
    }, {
      fromPath: ['areaId'],
      toPath: ['relationships','area','data', 'id']
    }, {
      toPath: ['relationships','area','data', 'type'],
      toValue: 'areas'
    },{
      fromPath: ['creator'],
      toPath: ['relationships','creator','data', 'id'],
    }, {
      toPath: ['relationships','creator','data', 'type'],
      toValue: 'identities'
    }, {
      fromPath: ['iterationId'],
      toPath: ['relationships','iteration','data'],
      toFunction: (id: string) => {
        return {
          id: id,
          type: 'iterations'
        }
      }
    }, {
      fromPath: ['type'],
      toPath: ['relationships','baseType','data'],
      toFunction: this.wiTypeMapper.toServiceModel.bind(this.wiTypeMapper)
    }, {
      fromPath: ['commentLink'],
      toPath: ['relationships','comments','links', 'related']
    },{
      fromPath: ['eventLink'],
      toPath: ['relationships','events','links', 'related']
    }, {
      fromPath: ['assignees'],
      toPath: ['relationships','assignees','data'],
      toFunction: function(assignees: string[]) {
        if (!assignees) return null;
        return assignees.map(assigneeId => {
          return {
            id: assigneeId,
            type: 'identities'
          }
        })
      }
    }, {
      fromPath: ['labels'],
      toPath: ['relationships','labels','data'],
      toFunction: function(labels: LabelUI[]) {
        if (!labels) return null;
        return labels.map(
          label => cleanObject(
            this.labelMapper.toServiceModel({id: label}),
            ['attributes', 'links', 'relationships']
          )
        );
      }.bind(this)
    }, {
      fromPath: ['hasChildren'],
      toPath: ['relationships','children', 'meta', 'hasChildren']
    }, {
      fromPath: ['parentID'],
      toPath: ['relationships','parent','data','id'],
    }, {
      fromPath: ['childrenLink'],
      toPath: ['relationships','children','links','related'],
    }, {
      toPath: ['type'],
      toValue: 'workitems'
    }
  ];

  toDynamicUIModel(arg: WorkItemService, dynamicFields) {
    let serviceToDyanmicUiMapTree: MapTree = [];
    for(let i = 0; i < dynamicFields.length; i++) {
      serviceToDyanmicUiMapTree.push({
        toPath: ['dynamicfields', dynamicFields[i]],
        fromPath: ['attributes', dynamicFields[i]]
      });
    }
    return switchModel<WorkItemService, any>(
      arg, serviceToDyanmicUiMapTree
    );
  }

  toDyanmicServiceModel(arg: WorkItemUI) {
    let dynamicUiToServiceMapTree: MapTree = [];
    for(let i = 0; i < arg.type.dynamicfields.length; i++) {
      dynamicUiToServiceMapTree.push({
        toPath: ['attributes', arg.type.dynamicfields[i]],
        fromPath: ['dynamicfields', arg.type.dynamicfields[i]]
      });
    }
    const serviceModel = switchModel<WorkItemUI, any>(
      arg, dynamicUiToServiceMapTree
    );
    return cleanObject(serviceModel);
  }

  toUIModel(arg: WorkItemService): WorkItemUI {
    return switchModel<WorkItemService, WorkItemUI>(
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: WorkItemUI): WorkItemService {
    let serviceModel =
      switchModel<WorkItemUI, WorkItemService>(
        arg, this.uiToServiceMapTree
      );

    // Removing relationship part of iteration
    if (serviceModel.relationships.iteration.data !== null) {
      serviceModel.relationships.iteration.data =
        cleanObject(serviceModel.relationships.iteration.data, ['relationships']);
    }

    // Removing attributes from assignees
    if (serviceModel.relationships.assignees.data !== null) {
      serviceModel.relationships.assignees.data =
        serviceModel.relationships.assignees.data.map(a => {
          return cleanObject(a, ['attributes']);
        });
    }

    // Removing relationship part of baseType
    if (serviceModel.relationships.baseType.data !== null) {
      serviceModel.relationships.baseType.data =
        cleanObject(serviceModel.relationships.baseType.data, ['relationships']);
    }

    return cleanObject(serviceModel);
  }

  cleanModel(arg: WorkItemService, keysToRemove: string[] = []) {
    return cleanObject(arg, keysToRemove);
  }
}

export class WorkItemResolver {
  constructor(private workItem: WorkItemUI) {}

  resolveType(types: WorkItemTypeUI[]) {
    const type = types.find(t => t.id === this.workItem.type.id);
    if (type) {
      this.workItem.type = cloneDeep(type);
    }
  }

  getWorkItem() {
    return this.workItem;
  }
}

@Injectable()
export class WorkItemQuery {
  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery,
    private iterationQuery: IterationQuery,
    private areaQuery: AreaQuery,
    private labelQuery: LabelQuery
  ) {}

  private listPageSelector = createFeatureSelector<ListPage>('listPage');
  private workItemSelector = createSelector(
    this.listPageSelector,
    state => state.workItems
  );
  private workItemEntities = createSelector(
    this.workItemSelector,
    selectEntities
  );
  private getAllWorkItemSelector = createSelector(
    this.workItemSelector,
    selectAll
  );
  private workItemSource = this.store
    .select(this.getAllWorkItemSelector);

  private workItemDetailSource = this.store
    .select(state => state.detailPage)
    .select(state => state.workItem);

  getWorkItems(): Observable<WorkItemUI[]> {
    return this.workItemSource.map(workItems => {
      return workItems.map(workItem => {
        return {
          ...workItem,
          creatorObs: this.userQuery.getUserObservableById(workItem.creator),
          assigneesObs: this.userQuery.getUserObservablesByIds(workItem.assignees),
          iterationObs: this.iterationQuery.getIterationObservableById(workItem.iterationId),
          areaObs: this.areaQuery.getAreaObservableById(workItem.areaId),
          labelsObs: this.labelQuery.getLabelObservablesByIds(workItem.labels)
        };
      });
    })
  }

  getWorkItem(number: string | number): Observable<WorkItemUI> {
    return this.workItemDetailSource
    .filter(item => item !== null)
    .map(workItem => {
      return {
        ...workItem,
        creatorObs: this.userQuery.getUserObservableById(workItem.creator),
        assigneesObs: this.userQuery.getUserObservablesByIds(workItem.assignees),
        iterationObs: this.store.select('listPage').select('iterations').select(workItem.iterationId),
        areaObs: this.store.select('listPage').select('areas').select(state => state[workItem.areaId]),
        labelsObs: this.labelQuery.getLabelObservablesByIds(workItem.labels)
      }
    });
  }

  /**
   * This function returns an observable for the the selector component
   * with iteration data and the selected iteration flagged
   * This data can be used in work item detail page for the
   * iteration selector dropdown.
   * @param number
   */
  getIterationsForWorkItem(number: string | number): Observable<CommonSelectorUI[]> {
    return this.getWorkItem(number)
      .filter(w => !!w)
      .switchMap(workitem => {
        return this.iterationQuery.getIterations().map(iterations => {
          return iterations.map(i => {
            return {
              key: i.id,
              value: (i.resolvedParentPath!='/'?i.resolvedParentPath:'') + '/' + i.name,
              selected: i.id === workitem.iterationId,
              cssLabelClass: undefined
            }
          })
        });
      })
  }

  /**
   * This function returns an observable for the the selector component
   * with area data and the selected area flagged
   * This data can be used in work item detail page for the
   * area selector dropdown.
   * @param number
   */
  getAreasForWorkItem(number: string | number): Observable<CommonSelectorUI[]> {
    return this.getWorkItem(number)
      .filter(w => !!w)
      .switchMap(workItem => {
        return this.areaQuery.getAreas()
          .map(areas => {
            return areas.map(area => {
              return {
                key: area.id,
                value: (area.parentPathResolved!='/'?area.parentPathResolved:'') + '/' + area.name,
                selected: area.id === workItem.areaId,
                cssLabelClass: undefined
              }
            })
          })
      })
  }
}
