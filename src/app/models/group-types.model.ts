export class GroupTypesModel {
  attributes: WITGroupAttributes;
  id: string;
  links?: {
    related: string;
  };
  relationships?: WorkItemRelations;
  type: string;
}

export class WITGroupAttributes {
  bucket: string;
  name: string;
  ['show-in-sidebar']: boolean;
}

export class WorkItemRelations {
  defaultType?: {
    data?: object,
    links?: object
  };
  nextGroup?: {
    data?: object,
    links?: object
  };
  spaceTemplate: {
    data?: object,
    links?: object
  };
  typeList?: {
    data?: TypeListData[]
  }
}

export class TypeListData {
  id: string;
  workitemtype: string;
}
