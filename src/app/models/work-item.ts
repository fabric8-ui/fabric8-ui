import { WorkItemType } from './work-item-type';
import { AreaModel } from './area.model';
import { Comments, Comment } from './comment';
import { Link } from './link';
import { User } from 'ngx-login-client';
import { IterationModel } from './iteration.model';

export class WorkItem {
  attributes: WorkItemAttributes;
  id: string;
  relationships?: WorkItemRelations;
  type: string;
  relationalData?: RelationalData;
  links?: {
    self: string;
    sourceLinkTypes?: string;
    targetLinkTypes?: string;
  };
}

export class WorkItemAttributes {
  'system.created_at'?: string;
  'system.description'?: any;
  'system.description.rendered'?: string;
  'system.remote_item_id'?: string;
  'system.state'?: string;
  'system.title'?: string;
  'version': number;
  'previousitem'?: string | number;
  'nextitem'?: string | number;
  'order'?: number | string;
}

export class WorkItemRelations {
  area: {
    data: AreaModel
  };
  assignees: {
    data: User[]
  };
  baseType: {
    data: WorkItemType;
  };
  childs?: {
    links: {
      self: string;
      related: string;
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
  creator: {
    data: User;
  };
  iteration: {
    data: {
      id: string,
      type: string
    }
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
