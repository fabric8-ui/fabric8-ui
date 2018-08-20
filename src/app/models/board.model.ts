import { Injectable } from '@angular/core';

// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'plannerSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import { createFeatureSelector, createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as WorkItemActions from './../actions/work-item.actions';
import { FilterService } from './../services/filter.service';
import { BoardViewState } from './../states/app.state';
import { AppState } from './../states/index.state';
import {
  cleanObject,
  CommonSelectorUI,
  Mapper,
  MapTree,
  modelService,
  switchModel
} from './common.model';
import { SpaceQuery } from './space';
import { WorkItemQuery, WorkItemUI } from './work-item';

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
    columnOrder: number;
    type: string;
    workItems?: Observable<WorkItemUI[]>
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

export const boardSelector = createFeatureSelector<BoardViewState>('boardView');
export const boardsEntitySelector = createSelector(
  boardSelector,
  (state) => state ? state.boards : {}
);

@Injectable()
export class BoardQuery {
  private boardSource = this.store.select(boardsEntitySelector);

  constructor(private store: Store<AppState>,
        private columnWorkItemQuery: ColumnWorkItemQuery,
        private spaceQuery: SpaceQuery,
        private filterService: FilterService) {}

  getBoardById(id: string, iterationID: string = ''): Observable<BoardModelUI> {
    return this.boardSource.select(id)
      .filter(board => !!board)
      .do((board) => {
        const boardQuery = this.filterService.queryBuilder(
          'board.id', this.filterService.equal_notation, board.id
        );
        let finalQuery = this.filterService.queryJoiner(
          {}, this.filterService.and_notation, boardQuery
        );
        if (iterationID !== '') {
          const iterationQuery = this.filterService.queryBuilder(
            'iteration', this.filterService.equal_notation, iterationID
          );
          finalQuery = this.filterService.queryJoiner(
            finalQuery, this.filterService.and_notation, iterationQuery
          );
        }
        this.store.dispatch(new WorkItemActions.Get({
          pageSize: 200,
          filters: finalQuery,
          isShowTree: false
        }));
      })
      .map(board => {
        return {
          ...board,
          columns: board.columns
            .map(col => {
              return {
                ...col,
                workItems: this.columnWorkItemQuery.getWorkItemsByColumnId(col.id)
              };
            })
        };
      });
  }
}

@Injectable()
export class ColumnWorkItemQuery {
  private columnWorkitems = createSelector(
    boardSelector,
    (state) => state ? state.columnWorkItem : {}
  );

  private columnWorkitemSource = this.store.select(this.columnWorkitems);

  constructor(
    private store: Store<AppState>,
    private workItemQuery: WorkItemQuery
  ) {}

  getWorkItemsByColumnId(id: string): Observable<WorkItemUI[]> {
    return this.columnWorkitemSource.select(state => state[id])
      .map(items => items || [])
      .switchMap(ids => this.workItemQuery.getWorkItemsByIds(ids));
  }
}

@Injectable()
export class BoardUIQuery {
  private boardUiSelector = createSelector(
    boardSelector,
    state => state.boardUi
  );
  constructor(private store: Store<AppState>) {}

  get boardLocked(): Observable<boolean> {
    return this.store.select(this.boardUiSelector)
      .select(state => state.lockBoard)
      .filter(l => !!l);
  }
}
