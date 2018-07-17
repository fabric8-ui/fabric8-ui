import {
    cleanObject,
    CommonSelectorUI,
    Mapper,
    MapTree,
    modelService,
    switchModel
} from './common.model';

export class BoardModelData {
    id: string;
    attributes: {
        name: string;
        description: string;
        contextType: string;  // this designates the type of the context
        context: string;  // this designates the ID of the context, in this case the typegroup ID
        'created-at': string;
        'updated-at': string;
    };
    relationships: {
        spaceTemplate: {
            data: {
                id: string;
                type: string;
            }
        };
        columns: {
            data?: {
                id: string;
                type: string;
            }[];
        };
    };
    type: string;
}

export class BoardModel {
    data: BoardModelData[];
    included: ({
        attributes: {
            id: string;
            name: string;
        }
        columnOrder: 0;  // the left-to-right order of the column in the view
        type: string;
    } | any)[];
}


export class BoardModelUI {
    id: string;
    name: string;
    description: string;
    contextType: string;
    context: string;
    columns: {
        id: string;
        title: string;
        columnOrder: 0;
        type: string;
    }[];
}


export class BoardMapper implements Mapper<BoardModelData, BoardModelUI> {
    serviceToUiMapTree: MapTree = [{
        fromPath: ['id'],
        toPath: ['id']
    }, {
        fromPath: ['attributes', 'name'],
        toPath: ['name']
    }, {
        fromPath: ['attributes', 'description'],
        toPath: ['description']
    }, {
        fromPath: ['attributes', 'contextType'],
        toPath: ['contextType']
    }, {
        fromPath: ['attributes', 'context'],
        toPath: ['context']
    }, {
        fromPath: ['relationships', 'columns', 'data'],
        toPath: ['columns'],
        toFunction: (data) => {
            return Array.isArray(data) ? data.map(col => {
              return {
                id: col.id,
                title: col.attributes.name,
                columnOrder: col.attributes.order,
                type: col.type
              };
            }) : [];
        }
    }];

    uiToServiceMapTree: MapTree = [];

    toUIModel(arg: BoardModelData): BoardModelUI {
        return switchModel<BoardModelData, BoardModelUI>(
          arg, this.serviceToUiMapTree
        );
    }

    toServiceModel(arg: BoardModelUI): BoardModelData {
        return {} as BoardModelData;
    }
}
