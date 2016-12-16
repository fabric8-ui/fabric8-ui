import { Comments, Comment } from './comment';
import { Link } from './link';
import { User } from './user';

export class WorkItem {
  attributes: WorkItemAttributes;
  id: string;
  relationships: WorkItemRelations;
  type: string;
  relationalData?: RelationalData;
}

export class WorkItemAttributes {
  'system.created_at': string;
  'system.description': string;
  'system.remote_item_id': string;    
  'system.state': string;
  'system.title': string;
  'version': number;
}

export class WorkItemRelations {
  assignees: {
    data: {
      id: string,
      type: string
    }[]
  };
  baseType: {
    data: {
      id: string;
      type: string;
    }
  };
  comments?: {
    links: {
      self: string;
      related: string;
    };
  };
  creator: {
    data: {
      id: string,
      type: string
    }
  };
}

export class RelationalData {
  creator?: User;
  comments?: Comment[];
  assignees?: User[];
  linkDicts?: LinkDict[];
  totalLinkCount?: number;
}

export class LinkDict {
  linkName: any;
  links: Link[];
  count: number;
}