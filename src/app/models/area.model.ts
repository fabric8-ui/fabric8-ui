import {
  modelUI,
  Mapper,
  MapTree,
  switchModel,
} from './common.model';
export class AreaModel {
  attributes?: AreaAttributes;
  id: string;
  links?: AreaLinks;
  relationships?: AreaRelations;
  type: string;
}

export class AreaAttributes {
  name: string;
  description?: string;
  parent_path: string;
  parent_path_resolved: string;
}

export class AreaLinks {
  self: string;
}

export class AreaRelations {
  space: {
    data: {
      id: string;
      type: string;
    },
    links: {
      self: string;
    }
  };
  workitems: {
    links: {
      related: string;
    };
  };
}

export interface AreaUI extends modelUI {
  parentPath: string;
  parentPathResolved: string;
}

export interface AreaService extends AreaModel {}

export class AreaMapper implements Mapper<AreaService, AreaUI> {

  serviceToUiMapTree: MapTree = [{
    fromPath: ['id'],
    toPath: ['id']
  }, {
    fromPath: ['attributes', 'name'],
    toPath: ['name']
  }, {
    fromPath: ['attributes', 'parent_path'],
    toPath: ['parentPath']
  }, {
    fromPath: ['attributes', 'parent_path_resolved'],
    toPath: ['parentPathResolved']
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: ['id'],
    fromPath: ['id']
  }, {
    toPath: ['attributes', 'name'],
    fromPath: ['name']
  }, {
    toPath: ['attributes', 'parent_path'],
    fromPath: ['parentPath']
  }, {
    toPath: ['attributes', 'parent_path_resolved'],
    fromPath: ['parentPathResolved']
  }, {
    toPath: ['type'],
    toValue: 'areas'
  }];

  toUIModel(arg: AreaService): AreaUI {
    return switchModel<AreaService, AreaUI> (
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: AreaUI): AreaService {
    return switchModel<AreaUI, AreaService> (
      arg, this.uiToServiceMapTree
    )
  }
}
