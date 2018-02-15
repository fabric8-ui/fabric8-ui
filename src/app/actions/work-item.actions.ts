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

export class Add implements Action {
  payload: {workItem: WorkItemService, createId: number};
  constructor(
    payload: {workItem: WorkItemService, createId: number}
  ) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class Get implements Action {
  payload: {
    pageSize: number,
    filters: any[]
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
