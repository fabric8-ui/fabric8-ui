import { Action } from '@ngrx/store';
import { CustomQueryModel, CustomQueryService as CQService} from './../models/custom-query.model';

export const ADD = '[customQuery] Add';
export const ADD_SUCCESS = '[customQuery] AddSuccess';
export const ADD_ERROR = '[customQuery] AddError';
export const GET = '[customQuery] Get';
export const GET_SUCCESS = '[customQuery] GetSuccess';
export const GET_ERROR = '[customQuery] GetError';
export const SELECT = '[customQuery] Select';
export const SELECT_NONE = '[customQuery] Select None';

export class Add implements Action {
  payload: CustomQueryModel;

  constructor(payload: CustomQueryModel) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class AddSuccess implements Action {
  payload: CustomQueryModel;
  constructor(payload: CustomQueryModel) {
    this.payload = payload;
  }
  readonly type = ADD_SUCCESS;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}


export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: CustomQueryModel[];
  constructor(payload: CustomQueryModel[]) {
    this.payload = payload;
  };
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class Select implements Action {
  payload: CustomQueryModel;
  constructor(payload: CustomQueryModel) {
    this.payload = payload;
  };
  readonly type = SELECT;
}

export class SelectNone implements Action {
  readonly type = SELECT_NONE;
}


export type All
  = Get
  | GetSuccess
  | GetError
  | AddSuccess
  | AddError
  | Select
  | SelectNone
