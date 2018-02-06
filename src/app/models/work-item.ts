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
  number: string;
  createdAt: string;
  updatedAt: string;
  state: string;
  descriptionMarkup: string;
  descriptionRendered: string;
  version: number;
  link: string;


  area: AreaUI;
  iteration: IterationUI;
  assignees: UserUI[];
  creator: UserUI;
  type: WorkItemTypeUI;
  labels: LabelUI[];
  comments: CommentUI[];
  childrenLink: string;
  hasChildren: boolean;
  parentID: string;
  workItemLink: string;


  treeStatus: 'collapsed' | 'expanded' | 'disabled'; // collapsed
  childrenLoaded: boolean; // false
  bold: boolean; // false
}

export class WorkItemMapper implements Mapper<WorkItemService, WorkItemUI> {
  itMapper = new IterationMapper();
  wiTypeMapper = new WorkItemTypeMapper();
  areaMapper = new AreaMapper();
  userMapper = new UserMapper();
  lMapper = new LabelMapper();
  cMapper = new CommentMapper(this.userMapper);

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
      fromPath: ['attributes','createdAt'],
      toPath: ['createdAt']
    }, {
      fromPath: ['link','self'],
      toPath: ['link']
    }, {
      fromPath: ['relationalData','area'],
      toPath: ['area'],
      toFunction: this.areaMapper.toUIModel.bind(this.areaMapper)
    }, {
      fromPath: ['relationalData','creator'],
      toPath: ['creator'],
      toFunction: this.userMapper.toUIModel.bind(this.userMapper)
    }, {
      fromPath: ['relationalData','iteration'],
      toPath: ['iteration'],
      toFunction: this.itMapper.toUIModel.bind(this.itMapper)
    }, {
      fromPath: ['relationalData','comments'],
      toPath: ['comments'],
      toFunction: this.commentMapper.tempFunc.bind(this.commentMapper)
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
    return switchModel<WorkItemService, WorkItemUI>(
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: WorkItemUI): WorkItemService {
    return switchModel<WorkItemUI, WorkItemService>(
      arg, this.uiToServiceMapTree
    );
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
}
