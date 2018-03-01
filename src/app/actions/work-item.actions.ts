import { Action } from '@ngrx/store';
import { WorkItemUI, WorkItemService } from './../models/work-item';

export const ADD = '[workItem] Add';
export const GET = '[workItem] Get';
export const UPDATE = '[workItem] Update';
export const ADD_SUCCESS = '[workItem] AddSuccess';
export const ADD_ERROR = '[workItem] AddError';
export const GET_SUCCESS = '[workItem] GetSuccess';
export const GET_ERROR = '[workItem] GetError';
export const UPDATE_SUCCESS = '[workItem] UpdateSuccess';
export const UPDATE_ERROR = '[workItem] UpdateError';
export const GET_CHILDREN = '[workItem] GetChildren';
export const GET_CHILDREN_SUCCESS = '[workItem] GetChildrenSuccess';
export const GET_CHILDREN_ERROR = '[workItem] GetChildrenError';
export const REORDER = '[workItem] Reorder';
export const REORDER_ERROR = '[workItem] ReorderError';

export class Add implements Action {
  payload: {workItem: WorkItemService, createId: number, parentId: string};
  constructor(
    payload: {
      workItem: WorkItemService,
      createId: number,
      parentId: string
    }
  ) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class Get implements Action {
  payload: {
    pageSize: number,
    filters: any[],
    isShowTree: boolean
  }
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = GET;
}

export class Update implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = UPDATE;
}

export class AddSuccess implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = ADD_SUCCESS;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}

export class GetSuccess implements Action {
  payload: WorkItemUI[];
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class GetChildren implements Action {
  payload: WorkItemUI;
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = GET_CHILDREN;
}

export class GetChildrenSuccess implements Action {
  payload: {parent: WorkItemUI, children: WorkItemUI[]};
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = GET_CHILDREN_SUCCESS;
}

export class GetChildrenError implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = GET_CHILDREN_ERROR;
}

export class UpdateSuccess implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = UPDATE_SUCCESS;
}

export class UpdateError implements Action {
  readonly type = UPDATE_ERROR;
}

export class Reoder implements Action {
  readonly type = REORDER;
  payload: {
    workitem: WorkItemUI,
    destinationWorkitemID: string,
    direction: string
  };
  constructor(payload: {
    workitem: WorkItemUI,
    destinationWorkitemID: string,
    direction: string
  }) { this.payload = payload; }
}

export class ReoderError implements Action {
  readonly type = REORDER_ERROR;
}

export type All
  = Add
  | Get
  | Update
  | AddSuccess
  | AddError
  | GetSuccess
  | GetError
  | UpdateSuccess
  | UpdateError
  | GetChildren
  | GetChildrenSuccess
  | GetChildrenError
  | Reoder
  | ReoderError
