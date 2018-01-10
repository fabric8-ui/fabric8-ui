import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as AreaActions from './../actions/area.actions';
import { AreaState, initialState } from './../states/area.state';
import { cloneDeep } from 'lodash';

import { AreaModel } from './../models/area.model';

export type Action = AreaActions.All;

export const AreaReducer: ActionReducer<AreaState> = (state = initialState, action: Action) => {
  switch(action.type) {
    case AreaActions.GET_SUCCESS: {
      return cloneDeep(action.payload);
    }
    case AreaActions.GET_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
