import {
  modelUI,
  Mapper,
  MapTree,
  switchModel
} from './common.model';

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
  state: string;
  link: string;
  workItemCount: number;
  type: string;
}

export class IterationMapper implements Mapper<IterationModel, IterationUI> {
  
  serviceToUiMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['attributes','name'],
      toPath: ['name']
    }, {
      fromPath: ['attributes','parent_path'],
      toPath: ['parentPath']
    }, {
      fromPath: ['attributes','resolved_parent_path'],
      toPath: ['resolvedParentPath']
    }, {
      fromPath: ['attributes','user_active'],
      toPath: ['userActive']
    }, {
      fromPath: ['attributes','active_status'],
      toPath: ['isActive']
    }, {
      fromPath: ['attributes','startAt'],
      toPath: ['startAt']
    }, {
      fromPath: ['attributes','endAt'],
      toPath: ['endAt']
    }, {
      fromPath: ['attributes','description'],
      toPath: ['description']
    }, {
      fromPath: ['attributes','state'],
      toPath: ['state']
    }, {
      fromPath: ['links','self'],
      toPath: ['link']
    }, {
      fromPath: ['relationships','workitems','meta','total'],
      toPath: ['workItemCount']
    }, {
      fromPath: ['type'],
      toPath: ['type']
    }
  ];

  uiToServiceMapTree: MapTree = [{
      toPath: ['id'],
      fromPath: ['id']
    }, {
      toPath: ['attributes','name'],
      fromPath: ['name']
    }, {
      toPath: ['attributes','parent_path'],
      fromPath: ['parentPath']
    }, {
      toPath: ['attributes','resolved_parent_path'],
      fromPath: ['resolvedParentPath']
    }, {
      toPath: ['attributes','user_active'],
      fromPath: ['userActive']
    }, {
      toPath: ['attributes','active_status'],
      fromPath: ['isActive']
    }, {
      toPath: ['attributes','startAt'],
      fromPath: ['startAt']
    }, {
      toPath: ['attributes','endAt'],
      fromPath: ['endAt']
    }, {
      toPath: ['attributes','description'],
      fromPath: ['description']
    }, {
      toPath: ['attributes','state'],
      fromPath: ['state']
    }, {
      toPath: ['links','self'],
      fromPath: ['link']
    }, {
      toPath: ['relationships','workitems','meta','total'],
      fromPath: ['workItemCount']
    }, {
      toPath: ['type'],
      fromPath: ['type']
    }
  ];

  iterationServicetoIterationUI(iterations: IterationService[]): IterationUI[] {
    let iterationUI: IterationUI[];
    for(let i = 0; i < iterations.length; i = i + 1) { 
      iterationUI[i] = this.toUIModel(iterations[i]);
    }
    return iterationUI;
  }

  toUIModel(arg: IterationService): IterationUI {
    return switchModel<IterationService, IterationUI>(
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: IterationUI): IterationService {
    return switchModel<IterationUI, IterationService>(
      arg, this.uiToServiceMapTree
    );
  }
}
