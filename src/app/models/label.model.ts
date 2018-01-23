import {
  modelUI,
  Mapper,
  MapTree,
  switchModel
} from './common.model';

export class LabelModel {
  attributes: LabelAttributes;
  id?: string;
  links?: LabelLinks;
  relationships?: LabelRelationships;
  type?: string;
}

export class LabelAttributes {
  "background-color"?: string;
  "border-color"?: string;
  "created-at"?: string;
  name: string;
  "text-color"?: string;
  "updated-at"?: string;
  version?: number;
}

export class LabelLinks {
  related: string;
  self: string;
}

export class LabelRelationships {
  space: {
    data: {
      id: string;
      type: string;
    }
    links: {
      related: string;
      self: string;
    }
  }
}

export interface LabelService extends LabelModel {}

export interface LabelUI extends modelUI {
  version: number;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  type: string;
}

export class LabelMapper implements Mapper<LabelService, LabelUI> {

  serviceToUiMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['attributes','name'],
      toPath: ['name']
    }, {
      fromPath: ['attributes','background-color'],
      toPath: ['backgroundColor']
    }, {
      fromPath: ['attributes','version'],
      toPath: ['version']
    }, {
      fromPath: ['attributes','border-color'],
      toPath: ['borderColor']
    }, {
      fromPath: ['attributes','text-color'],
      toPath: ['textColor']
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
      toPath: ['attributes','background-color'],
      fromPath: ['backgroundColor']
    }, {
      toPath: ['attributes','version'],
      fromPath: ['version']
    }, {
      toPath: ['attributes','border-color'],
      fromPath: ['borderColor']
    }, {
      toPath: ['attributes','text-color'],
      fromPath: ['textColor']
    }, {
      toPath: ['type'],
      fromPath: ['type']
    }
  ];

  toUIModel(arg: LabelService): LabelUI {
    return switchModel<LabelService, LabelUI>(
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: LabelUI): LabelService {
    return switchModel<LabelUI, LabelService>(
      arg, this.uiToServiceMapTree
    );
  }
}
