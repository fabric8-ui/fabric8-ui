import { modelUI } from './common.model';

export class IterationModel {
  attributes?: IterationAttributes;
  id: string;
  links?: IterationLinks;
  relationships?: IterationRelations;
  type: string;
  hasChildren?: boolean;
  children?: IterationModel[];
}

export class IterationAttributes {
  user_active?: boolean;
  active_status?: boolean;
  endAt?: string;
  startAt?: string;
  name: string;
  state: string;
  description?: string;
  parent_path: string;
  resolved_parent_path?: string;
}

export class IterationLinks {
  self: string;
}

export class IterationRelations {
  parent?: {
    data: {
      id: string,
      type: string
    },
    links: {
      self: string
    }
  };
  space: {
    data: {
      id: string;
      type: string;
    };
    links: {
      self: string;
    };
  };
  workitems: {
    links: {
      related: string;
    };
    meta: {
      closed: number;
      total: number;
    };
  };
}

export type IterationService = IterationModel;

export interface IterationUI extends modelUI {
  parentPath: string; // attributes / parent_path
  resolvedParentPath: string; // attributes / resolved_parent_path
  userActive: boolean; // attributes / user_active
  isActive: boolean; // attributes / active_status
  startAt: string; // attributes / startAt
  endAt: string; // attributes / startAt
  description: string; // attributes / description
}
