import {
    cleanObject,
    CommonSelectorUI,
    Mapper,
    MapTree,
    modelService,
    switchModel
} from './common.model';

export class BoardModel {
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
            data: {
                    id: string;
                    type: string;
                }[];
        };
    };
    included: ({
        id: string;
        title: string;
        columnOrder: 0;  // the left-to-right order of the column in the view
        type: string;
    } | any)[];
    type: string;
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


export class BoardMapper implements Mapper<BoardModel, BoardModelUI> {
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
        fromPath: ['included'],
        toPath: ['columns'],
        toFunction: (data) =>
            Array.isArray(data) ? data.filter(d => d.type === 'boardcolumns') : []
    }];

    uiToServiceMapTree: MapTree = [];

    toUIModel(arg: BoardModel): BoardModelUI {
        return switchModel<BoardModel, BoardModelUI>(
          arg, this.serviceToUiMapTree
        );
    }

    toServiceModel(arg: BoardModelUI): BoardModel {
        return {} as BoardModel;
    }
}
