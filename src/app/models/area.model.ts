export class AreaModel {
  attributes: AreaAttributes;
  id: string;
  links?: AreaLinks;
  relationships: AreaRelations;
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
    meta: {
      closed: number;
      total: number;
    };
  };
}
