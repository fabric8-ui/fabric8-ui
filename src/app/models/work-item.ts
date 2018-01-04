import {
  WorkItemType,
  WorkItemTypeUI
} from './work-item-type';
import { AreaModel, AreaUI } from './area.model';
import { Comments, Comment, CommentUI } from './comment';
import { Link } from './link';
import { User } from 'ngx-login-client';
import { IterationModel, IterationUI } from './iteration.model';
import { LabelModel, LabelUI } from './label.model';
import { UserUI } from './user';

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


export interface WorkItemUI {
  id: string;
  title: string;
  number: string;
  type: WorkItemTypeUI;
  area: AreaUI;
  iteration: IterationUI;
  assignees: UserUI[];
  creator: UserUI;
  createdAt: string;
  labels: LabelUI[];
  comments: CommentUI[];
}
