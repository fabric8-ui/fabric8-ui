import {
  WorkItemType,
  WorkItemTypeUI,
  WorkItemTypeMapper
} from './work-item-type';
import { AreaModel, AreaUI, AreaMapper, AreaService } from './area.model';
import { Comments, Comment, CommentUI, CommentMapper } from './comment';
import { Link } from './link';
import { User } from 'ngx-login-client';
import { IterationModel, IterationUI, IterationMapper, IterationService } from './iteration.model';
import { LabelModel, LabelUI, LabelMapper, LabelService } from './label.model';
import { UserUI, UserMapper, UserService } from './user';
import {
  modelUI,
  Mapper,
  MapTree,
  switchModel
} from './common.model';

export class WorkItem {
  hasChildren?: boolean;
  attributes: object = {};
  id: string;
  number?: number;
  relationships?: WorkItemRelations;
  type: string;
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
    data?: User[]
  };
  labels?: {
    data?: LabelModel[];
  };
  baseType?: {
    data: WorkItemType;
  };
  parent?: {
    data: WorkItem;
  };
  children?: {
    links: {
      related: string;
    };
    meta: {
      hasChildren: boolean;
    };
  };
  comments?: {
    data?: Comment[];
    links: {
      self: string;
      related: string;
    };
    meta?: {
      totalCount?: number;
    }
  };
  creator?: {
    data: User;
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
}

export class RelationalData {
  area?: AreaModel;
  creator?: User;
  comments?: Comment[];
  parent?: WorkItem;
  assignees?: User[];
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
  sysNumber: string;
  type: WorkItemTypeUI;
  area: AreaUI;
  iteration: IterationUI;
  assignees: UserUI[];
  creator: UserUI;
  createdAt: string;
  labels: LabelUI[];
  comments: CommentUI[];
  wiState: string;
  wiDescription: string;
}

export class WorkItemMapper implements Mapper<WorkItemService, WorkItemUI> {
  itMapper = new IterationMapper();
  wiTypeMapper = new WorkItemTypeMapper();
  areaMapper = new AreaMapper();
  userMapper = new UserMapper();
  lMapper = new LabelMapper();
  cMapper = new CommentMapper();
  
  serviceToUiMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['attributes','system.title'],
      toPath: ['title']
    }, {
      fromPath: ['attributes','system.number'],
      toPath: ['sysNumber']
    }, {
      fromPath: ['attributes','createdAt'],
      toPath: ['createdAt']
    }, 
  ];

  uiToServiceMapTree: MapTree = [{
      toPath: ['id'],
      fromPath: ['id']
    }, {
      toPath: ['attributes','system.title'],
      fromPath: ['title']
    }, {
      toPath: ['type'],
      toValue: 'workitems'
    }, {
      toPath: ['attributes','system.state'],
      fromPath: ['wiState']
    }
  ];
  
  toUIModel(arg: WorkItemService): WorkItemUI {
    let workItemUI = switchModel<WorkItemService, WorkItemUI>(
      arg, this.serviceToUiMapTree
    );
    return this.tempToUIModel(arg, workItemUI);
  }

  tempToUIModel(arg: WorkItemService, workItemUI: WorkItemUI): WorkItemUI {
    workItemUI.area = this.areaMapper.toUIModel(arg.relationalData.area);
    workItemUI.assignees = arg.relationalData.assignees.map(a => this.userMapper.toUIModel(a));
    workItemUI.creator = this.userMapper.toUIModel(arg.relationalData.creator);
    workItemUI.comments = arg.relationalData.comments.map(c => this.cMapper.toUIModel(c));
    workItemUI.iteration = this.itMapper.toUIModel(arg.relationalData.iteration);
    workItemUI.labels = arg.relationalData.labels.map(l => this.lMapper.toUIModel(l));
    workItemUI.type = this.wiTypeMapper.toUIModel(arg.relationalData.wiType);
    return workItemUI;
  } 

  toServiceModel(arg: WorkItemUI): WorkItemService {
    let workItemService = switchModel<WorkItemUI, WorkItemService>(
      arg, this.uiToServiceMapTree
    );
    return this.tempToServiceModel(arg, workItemService);
  }

  tempToServiceModel(arg: WorkItemUI, workItemService: WorkItemService): WorkItemService {
    workItemService.relationalData.area = this.areaMapper.toServiceModel(arg.area);
    workItemService.relationalData.assignees = arg.assignees.map(a => this.userMapper.toServiceModel(a));
    workItemService.relationalData.creator = this.userMapper.toServiceModel(arg.creator);
    workItemService.relationalData.comments = arg.comments.map(c => this.cMapper.toServiceModel(c));
    workItemService.relationalData.iteration = this.itMapper.toServiceModel(arg.iteration);
    workItemService.relationalData.labels = arg.labels.map(l => this.lMapper.toServiceModel(l));
    workItemService.relationalData.wiType = this.wiTypeMapper.toServiceModel(arg.type);
    return workItemService;
  } 
}
