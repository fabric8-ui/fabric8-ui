import { modelUI } from './common.model';
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


export interface labelUI extends modelUI {
  // back
}
