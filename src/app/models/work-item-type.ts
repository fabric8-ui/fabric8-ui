import { Injectable } from '@angular/core';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

// Dictionary is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'workItemEntities' has or is using name 'Dictionary'
// from external module "@ngrx/entity/src/models" but cannot be named.
import { Dictionary } from '@ngrx/entity/src/models';

// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'workItemSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Space } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { AppState } from '../states/app.state';
import {
  Mapper,
  MapTree,
  modelService,
  modelUI,
  normalizeArray,
  switchModel
} from './common.model';
import { plannerSelector } from './space';
import { WorkItemService } from './work-item';

export class WorkItemType extends modelService {
    attributes?: {
      name: string;
      version: number;
      description: string;
      icon: string;
      fields: any;
    };
    relationships?: {
      guidedChildTypes?: {
        data?: WorkItemType[]
      },
      infoTip?: {
        data?: string;
      },
      space?: Space
    };
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
        fromPath: ['attributes', 'name'],
        toPath: ['name']
      }, {
        fromPath: ['attributes', 'icon'],
        toPath: ['icon']
      }, {
        fromPath: ['attributes', 'version'],
        toPath: ['version']
      }, {
        fromPath: ['attributes', 'description'],
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
        fromPath: ['relationships', 'infotip', 'data'],
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
        toPath: ['attributes', 'name'],
        fromPath: ['name']
      }, {
        toPath: ['attributes', 'icon'],
        fromPath: ['icon']
      }, {
        toPath: ['attributes', 'version'],
        fromPath: ['version']
      }, {
        toPath: ['attributes', 'description'],
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
  private allTypes: WorkItemTypeUI[];
  private normalizedTypes: {[id: string]: WorkItemTypeUI};

  constructor(allTypes: WorkItemTypeUI[] = []) {
    this.allTypes = allTypes;
    this.normalizedTypes = normalizeArray(allTypes);
  }

  resolveChildren() {
    this.allTypes.forEach(type => {
      type.childTypes = type.childTypes.map(ct => this.normalizedTypes[ct.id]);
    });
  }

  getResolvedWorkItemTypes() {
    return this.allTypes;
  }
}


function filterDynamicFields(fields: any[]) {
  if (fields !== null) {

    const fieldKeys = Object.keys(fields);
    // These fields won't show up in the details page
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
      'system.updated_at',
      'system.metastate'
    ];
    // These fields types won't show up in the details page
    const restrictedFieldTypes = [
      'float', 'string', 'integer', 'enum', 'markup'
    ];
    return fieldKeys.filter(
      f => {
        return staticFields.findIndex(sf => sf === f) === -1 &&
          restrictedFieldTypes.indexOf(fields[f].type.kind) > -1;
      }
    );
  } else {
    return [];
  }
}


// This interface is used to determine state for entity adapter
export interface WorkItemTypeStateModel extends EntityState<WorkItemTypeUI> {}

const workItemTypeAdapter = createEntityAdapter<WorkItemTypeUI>();

export const { selectIds, selectEntities, selectAll, selectTotal } = workItemTypeAdapter.getSelectors();

export const workItemTypeSelector = createSelector(
  plannerSelector,
  state => state ? state.workItemTypes : {ids: [], entities: {}}
);

export const getWorkItemTypeEntitiesSelector = createSelector(
  workItemTypeSelector,
  selectEntities
);

@Injectable()
export class WorkItemTypeQuery {

  constructor(private store: Store<AppState>) {
  }

  getAllWorkItemTypesSelector = createSelector(
    workItemTypeSelector,
    selectAll
  );

  getWorkItemTypesWithChildrenSelector = createSelector(
    this.getAllWorkItemTypesSelector,
    getWorkItemTypeEntitiesSelector,
    (types, typeEntities) => {
      return types.map(type => {
        const childTypes = type.childTypes.map(t => typeEntities[t.id]);
        type.childTypes = childTypes;
        return type;
      });
    }
  );

  workItemTypeSource = this.store.select(this.getAllWorkItemTypesSelector);
  workItemTypeEntities = this.store.select(getWorkItemTypeEntitiesSelector);

  /**
   * return observable of all workItemTypes
   * without their child types
   */
  getWorkItemTypes(): Observable<WorkItemTypeUI[]> {
    return this.workItemTypeSource.filter(w => !!w.length);
  }

  getWorkItemTypesWithChildren(): Observable<WorkItemTypeUI[]> {
    return this.store.select(this.getWorkItemTypesWithChildrenSelector)
      .filter(t => !!t.length);
  }

  getWorkItemTypeWithChildrenById(id: string): Observable<WorkItemTypeUI> {
    return this.store.select(this.getWorkItemTypesWithChildrenSelector)
      .map(types => {
        return types.filter(type => type.id === id)[0];
      });
  }

  getWorkItemTypeById(id: string): Observable<WorkItemTypeUI> {
    return this.workItemTypeEntities[id];
  }
}
