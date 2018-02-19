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

export class WorkItemTypeFieldUI {
  required: boolean;
  label: string;
  description: string;
  kind: string;
}

export interface WorkItemTypeService extends WorkItemType {}

export interface WorkItemTypeUI extends modelUI {
  icon: string;
  version: number;
  type: string;
  description: string;
  childTypes: WorkItemTypeUI[];
  fields: Map<string, WorkItemTypeFieldUI>;
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
        toFunction: (item: WorkItemService) => {
          return !!item ? item : [];
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
        fromPath: ['childTypes'],
        toPath: ['relationships', 'guidedChildTypes', 'data'],
        toFunction: (item: WorkItemService) => {
          return !!item ? item : [];
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
