import { WorkItemType } from './work-item-type';
import { AreaModel } from './area.model';
import { Comments, Comment } from './comment';
import { Link } from './link';
import { User } from 'ngx-login-client';
import { IterationModel } from './iteration.model';
import { LabelModel } from './label.model';

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
    data?: LabelModel[]
  };
  baseType?: {
    data: WorkItemType;
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
