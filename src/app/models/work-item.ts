import { cloneDeep } from 'lodash';
import {
  WorkItemType,
  WorkItemTypeUI,
  WorkItemTypeMapper
} from './work-item-type';
import { AreaModel, AreaUI, AreaMapper, AreaService } from './area.model';
import { Comments, Comment, CommentUI, CommentMapper } from './comment';
import { Link } from './link';
import { IterationModel, IterationUI, IterationMapper, IterationService } from './iteration.model';
import { LabelModel, LabelUI, LabelMapper, LabelService } from './label.model';
import { UserUI, UserMapper, UserService } from './user';
import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel,
  cleanObject
} from './common.model';

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

  area: AreaUI;
  iteration: IterationUI;
  assignees: UserUI[];
  creator: UserUI;
  type: WorkItemTypeUI;
  labels: LabelUI[];
  comments: CommentUI[];
  children: WorkItemUI[];
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

  createId: number; // this is used to identify newly created item
}

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
      fromPath: ['relationships','area','data'],
      toPath: ['area'],
      toFunction: this.areaMapper.toUIModel.bind(this.areaMapper)
    }, {
      fromPath: ['relationships','creator','data'],
      toPath: ['creator'],
      toFunction: this.userMapper.toUIModel.bind(this.userMapper)
    }, {
      fromPath: ['relationships','iteration','data'],
      toPath: ['iteration'],
      toFunction: this.itMapper.toUIModel.bind(this.itMapper)
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
        return assignees.map(assignee => this.userMapper.toUIModel(assignee))
      }.bind(this)
    }, {
      fromPath: ['relationships','labels','data'],
      toPath: ['labels'],
      toFunction: function(labels: LabelModel[]) {
        if (!labels) return [];
        return labels.map(label => this.labelMapper.toUIModel(label))
      }.bind(this)
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
      fromPath: ['area'],
      toPath: ['relationships','area','data'],
      toFunction: this.areaMapper.toServiceModel.bind(this.areaMapper)
    }, {
      fromPath: ['creator'],
      toPath: ['relationships','creator','data'],
      toFunction: this.userMapper.toServiceModel.bind(this.userMapper)
    }, {
      fromPath: ['iteration'],
      toPath: ['relationships','iteration','data'],
      toFunction: this.itMapper.toServiceModel.bind(this.itMapper)
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
      toFunction: function(assignees: UserUI[]) {
        if (!assignees) return null;
        return assignees.map(assignee => this.userMapper.toServiceModel(assignee))
      }.bind(this)
    }, {
      fromPath: ['labels'],
      toPath: ['relationships','labels','data'],
      toFunction: function(labels: LabelUI[]) {
        if (!labels) return null;
        return labels.map(label => this.labelMapper.toServiceModel(label))
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

  resolveArea(areas: AreaUI[]) {
    const area = areas.find(a => a.id === this.workItem.area.id);
    if (area) {
      this.workItem.area = cloneDeep(area);
    }
  }

  resolveIteration(iterations: IterationUI[]) {
    const iteration = iterations.find(it => it.id === this.workItem.iteration.id);
    if (iteration) {
      this.workItem.iteration = cloneDeep(iteration);
      // We don't need this much value for a work item
      this.workItem.iteration.children = [];
    }
  }

  resolveAssignees(users: UserUI[]) {
    this.workItem.assignees = this.workItem.assignees.map(assignee => {
      return cloneDeep(users.find(u => u.id === assignee.id));
    }).filter(item => !!item);
  }

  resolveCreator(users: UserUI[]) {
    const creator = users.find(user => user.id === this.workItem.creator.id);
    if(creator) {
      this.workItem.creator = cloneDeep(creator);
    }
  }

  resolveType(types: WorkItemTypeUI[]) {
    const type = types.find(t => t.id === this.workItem.type.id);
    if (type) {
      this.workItem.type = cloneDeep(type);
    }
  }

  resolveWiLabels(labels: LabelUI[]) {
    this.workItem.labels = this.workItem.labels.map(label => {
      return cloneDeep(labels.find(l => l.id === label.id));
    }).filter(item => !!item);
  }

  getWorkItem() {
    return this.workItem;
  }
}
