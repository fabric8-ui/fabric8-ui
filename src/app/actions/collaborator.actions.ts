import { Action } from '@ngrx/store';
import { User } from 'ngx-login-client';

export const GET = '[collaborator] Get';
export const GET_SUCCESS = '[collaborator] GetSuccess';
export const GET_ERROR = '[collaborator] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: User[];

  constructor(payload: User[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All
  = Get
  | GetSuccess
  | GetError
