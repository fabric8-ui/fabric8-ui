import {
  Mapper,
  MapTree,
  switchModel
} from './common.model';

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
  level: number[];
  icon: string;
  sublevel?: number;
  group: string;
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

export interface GroupTypeService extends GroupTypesModel {}

export interface GroupTypeUI extends GroupTypesModel {
  selected: boolean;
}

export class GroupTypeMapper implements Mapper<GroupTypeService, GroupTypeUI> {

  serviceToUiMapTree: MapTree = [{
      fromPath: ['level'],
      toPath: ['level']
    }, {
      fromPath: ['icon'],
      toPath: ['icon']
    }, {
      fromPath: ['sublevel'],
      toPath: ['sublevel']
    }, {
      fromPath: ['group'],
      toPath: ['group']
    }, {
      fromPath: ['name'],
      toPath: ['name']
    }, {
      fromPath: ['wit_collection'],
      toPath: ['wit_collection']
    }, {
      toPath: ['selected'],
      toValue: false
    }];

  uiToServiceMapTree: MapTree = [{
      fromPath: ['level'],
      toPath: ['level']
    }, {
      fromPath: ['icon'],
      toPath: ['icon']
    }, {
      fromPath: ['sublevel'],
      toPath: ['sublevel']
    }, {
      fromPath: ['group'],
      toPath: ['group']
    }, {
      fromPath: ['name'],
      toPath: ['name']
    }, {
      fromPath: ['wit_collection'],
      toPath: ['wit_collection']
    }];

  toUIModel(arg: GroupTypeService): GroupTypeUI {
    return switchModel<GroupTypeService, GroupTypeUI>(
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: GroupTypeUI): GroupTypeService {
    return switchModel<GroupTypeService, GroupTypeUI>(
      arg, this.uiToServiceMapTree
    )
  }
}
