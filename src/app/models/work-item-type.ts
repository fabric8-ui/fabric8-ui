import { Space } from "ngx-fabric8-wit";
import {
  modelUI,
  Mapper,
  MapTree,
  switchModel
} from './common.model';

export class WorkItemType {
    id: string;
    type: string;
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
        fromPath: ['type']
      }
    ];
    
    WorkItemTypeServicetoWorkItemTypeUI(types: WorkItemTypeService[]): WorkItemTypeUI[] {
      let workItemTypeUI: WorkItemTypeUI[];
      for(let i = 0; i < types.length; i = i + 1)
      { 
        workItemTypeUI[i] = this.toUIModel(types[i]);
      }
      return workItemTypeUI;
    }
    
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
