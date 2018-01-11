import { Space } from "ngx-fabric8-wit";
import { modelUI } from "./common.model";

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

export interface WorkItemTypeUI extends modelUI {
  icon: string;
  version: number;
}
