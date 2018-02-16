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
        fields: Map<string, WorkItemTypeField>;
    };
    relationships? : {
      guidedChildTypes?: {
        data?: WorkItemType[]
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
  childTypeIds: string[]
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
        toPath: ['childTypeIds'],
        toFunction: (types: WorkItemTypeService[]) => {
          if (!types) {
            return [];
          }
          return types.map(t => t.id);
        }
      }
    ];

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
        fromPath: ['childTypeIds'],
        toPath: ['relationships', 'guidedChildTypes', 'data'],
        toFunction: (types: WorkItemTypeUI[]) => {
          if (!types) {
            return [];
          }
          return types.map(t => {
            return {
              id: t,
              type: 'workitemtypes'
            }
          });
        }
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
