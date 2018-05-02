import { WorkItemService } from './work-item';
import { Space } from "ngx-fabric8-wit";
import {
  modelUI,
  Mapper,
  MapTree,
  switchModel,
  modelService
} from './common.model';

export class WorkItemType extends modelService{
    attributes?: {
      name: string;
      version: number;
      description: string;
      icon: string;
      fields: any;
    };
    relationships? : {
      guidedChildTypes?: {
        data?: WorkItemType[]
      },
      infoTip?: {
        data?: string;
      },
      space?: Space
    }
}

export class WorkItemTypeField {
    description?: string;
    label: string;
    required: boolean;
    type: {
      componentType?: string,
      baseType?: string,
      kind: string,
      values?: string[]
    };
}

export interface WorkItemTypeService extends WorkItemType {}

export interface WorkItemTypeUI extends modelUI {
  icon: string;
  version: number;
  type: string;
  description: string;
  childTypes: any;
  infotip: string;
  // TODO: [Symbol.toStringTag]' is missing in type fix
  // `any` should go away
  fields: Map<string, WorkItemTypeField> | any;
  dynamicfields?: any;
}

export class WorkItemTypeMapper implements Mapper<WorkItemTypeService, WorkItemTypeUI> {

    serviceToUiMapTree: MapTree = [{
        fromPath: ['id'],
        toPath: ['id']
      }, {
        fromPath: ['attributes','name'],
        toPath: ['name']
      }, {
        fromPath: ['attributes','icon'],
        toPath: ['icon']
      }, {
        fromPath: ['attributes','version'],
        toPath: ['version']
      }, {
        fromPath: ['attributes','description'],
        toPath: ['description']
      }, {
        fromPath: ['relationships', 'guidedChildTypes', 'data'],
        toPath: ['childTypes'],
        toFunction: (item: WorkItemTypeService) => {
          return !!item ? item : [];
        }
      }, {
        fromPath: ['attributes', 'fields'],
        toPath: ['fields']
      }, {
        fromPath: ['attributes', 'fields'],
        toPath: ['dynamicfields'],
        toFunction: filterDynamicFields
      }, {
        toPath: ['type'],
        toValue: 'workitemtypes'
      }, {
        fromPath: ['relationships','infotip','data'],
        toPath: ['infotip'],
        toFunction: function(value) {
          if (value === null) {
            return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
          }
          return value;
        }
    }];

    uiToServiceMapTree: MapTree = [{
        toPath: ['id'],
        fromPath: ['id']
      }, {
        toPath: ['attributes','name'],
        fromPath: ['name']
      }, {
        toPath: ['attributes','icon'],
        fromPath: ['icon']
      }, {
        toPath: ['attributes','version'],
        fromPath: ['version']
      }, {
        toPath: ['attributes','description'],
        fromPath: ['description']
      }, {
        toPath: ['type'],
        toValue: 'workitemtypes'
      }, {
        fromPath: ['childTypes'],
        toPath: ['relationships', 'guidedChildTypes', 'data'],
        toFunction: (item: WorkItemTypeUI) => {
          return !!item ? item : [];
        }
      }, {
        toPath: ['attributes', 'fields'],
        fromPath: ['fields']
      }
    ];

    toUIModel(arg: WorkItemTypeService): WorkItemTypeUI {
      return switchModel<WorkItemTypeService, WorkItemTypeUI>(
        arg, this.serviceToUiMapTree
      );
    }

    toServiceModel(arg: WorkItemTypeUI): WorkItemTypeService {
      return switchModel<WorkItemTypeUI, WorkItemTypeService>(
        arg, this.uiToServiceMapTree
      );
    }
}


export class WorkItemTypeResolver {
  private allTypes:  WorkItemTypeUI[];

  constructor(allTypes: WorkItemTypeUI[] = []) {
    this.allTypes = allTypes;
  }

  resolveChildren() {
    this.allTypes.forEach(type => {
      type.childTypes = this.allTypes.filter(t => {
        return type.childTypes.findIndex(ct => ct.id === t.id) > -1;
      })
    })
  }

  getResolvedWorkItemTypes() {
    return this.allTypes;
  }
}


function filterDynamicFields(fields: any[]) {
  if (fields !== null) {

    const fieldKeys = Object.keys(fields);
    const staticFields = [
      'system.area',
      'system.assignees',
      'system.codebase',
      'system.created_at',
      'system.creator',
      'system.description',
      'system.iteration',
      'system.labels',
      'system.number',
      'system.order',
      'system.remote_item_id',
      'system.state',
      'system.title',
      'system.updated_at'
    ];
    return fieldKeys.filter(
      f => {
        return staticFields.findIndex(sf => sf === f) === -1 &&
               ['enum', 'markup'].indexOf(fields[f].type.kind) > -1;
      }
    );
  } else {
    return [];
  }
}
