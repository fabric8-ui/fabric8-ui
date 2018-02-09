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
      fromPath: ['attributes','version'],
      toPath: ['version']
    }, {
      fromPath: ['links','self'],
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
      fromPath: ['relationalData','wiType'],
      toPath: ['type'],
      toFunction: this.wiTypeMapper.toUIModel.bind(this.wiTypeMapper)
    }, {
      fromPath: ['relationalData','comments'],
      toPath: ['comments'],
      toFunction: function(comments: Comment[]) {
        return comments.map(comment => this.commentMapper.toUIModel(comment))
      }.bind(this.commentMapper)
    }, {
      fromPath: ['relationalData','assignees'],
      toPath: ['assignees'],
      toFunction: function(assignees: User[]) {
        return assignees.map(assignee => this.userMapper.toUIModel(assignee))
      }.bind(this.userMapper)
    }, {
      fromPath: ['relationalData','labels'],
      toPath: ['labels'],
      toFunction: function(labels: LabelModel[]) {
        return labels.map(label => this.labelMapper.toUIModel(label))
      }.bind(this.labelMapper)
    }, {
      toPath: ['treeStatus'],
      toValue: 'collapsed'
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
      toPath: ['attributes','system.title'],
      fromPath: ['title']
    }, {
      toPath: ['attributes','system.created_at'],
      fromPath: ['createdAt']
    }, {
      toPath: ['attributes','system.updated_at'],
      fromPath: ['updatedAt']
    }, {
      toPath: ['attributes','system.state'],
      fromPath: ['state']
    }, {
      toPath: ['attributes','system.description.markup'],
      fromPath: ['descriptionMarkup']
    }, {
      toPath: ['attributes','system.description.rendered'],
      fromPath: ['descriptionRendered']
    }, {
      toPath: ['attributes','version'],
      fromPath: ['version']
    }, {
      toPath: ['links','self'],
      fromPath: ['link']
    }, {
      toPath: ['relationalData','area'],
      fromPath: ['area'],
      toFunction: this.areaMapper.toServiceModel.bind(this.areaMapper)
    }, {
      toPath: ['relationalData','creator'],
      fromPath: ['creator'],
      toFunction: this.userMapper.toServiceModel.bind(this.userMapper)
    }, {
      toPath: ['relationalData','iteration'],
      fromPath: ['iteration'],
      toFunction: this.itMapper.toServiceModel.bind(this.itMapper)
    }, {
      toPath: ['relationalData','wiType'],
      fromPath: ['type'],
      toFunction: this.wiTypeMapper.toServiceModel.bind(this.wiTypeMapper)
    }, {
      toPath: ['relationalData','comments'],
      fromPath: ['comments'],
      toFunction: function(comments: CommentUI[]) {
        return comments.map(comment => this.commentMapper.toServiceModel(comment))
      }.bind(this.commentMapper)
    }, {
      toPath: ['relationalData','assignees'],
      fromPath: ['assignees'],
      toFunction: function(assignees: UserUI[]) {
        return assignees.map(assignee => this.userMapper.toServiceModel(assignee))
      }.bind(this.userMapper)
    }, {
      fromPath: ['relationalData','labels'],
      toPath: ['labels'],
      toFunction: function(labels: LabelUI[]) {
        return labels.map(label => this.labelMapper.toServiceModel(label))
      }.bind(this.labelMapper)
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
}
