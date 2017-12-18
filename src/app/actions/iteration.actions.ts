import { Action } from '@ngrx/store';

export const ADD            = '[Iteration] Add';
export const UPDATE         = '[Iteration] Update';
export const GET            = '[Iteration] Get';
export const GET_SUCCESS    = '[Iteration] GetSuccess';
export const GET_ERROR      = '[Iteration] GetError';
export const ADD_SUCCESS    = '[Iteration] AddSuccess';
export const ADD_ERROR      = '[Iteration] AddError';
export const UPDATE_SUCCESS = '[Iteration] UpdateSuccess';
export const UPDATE_ERROR   = '[Iteration] UpdateError';

export class Add implements Action {
  readonly type = ADD;
}

export class Update implements Action {
  readonly type = UPDATE;
}

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload : any;
  constructor(payload: any){
    this.payload = payload;
  };
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class AddSuccess implements Action {
  readonly type = ADD_SUCCESS;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
}

export class UpdateError implements Action {
  readonly type = UPDATE_ERROR;
}


export type All
  = Add
  | Update
  | Get
  | GetSuccess
  | GetError
  | AddSuccess
  | AddError
  | UpdateSuccess
  | UpdateError;