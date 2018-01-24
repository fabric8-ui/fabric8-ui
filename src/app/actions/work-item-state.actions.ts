import { Action } from '@ngrx/store';
import { WorkItemTypeUI } from '../models/work-item-type';

export const GET = '[wi-state] Get';
export const GET_SUCCESS = '[wi-state] GetSuccess';
export const GET_ERROR = '[wi-state] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: WorkItemTypeUI[];
  constructor(payload: WorkItemTypeUI[]) {
    this.payload = payload;
  };
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All
  = Get
  | GetSuccess
  | GetError
