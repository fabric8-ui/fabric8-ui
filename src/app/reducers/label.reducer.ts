import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as LabelActions  from './../actions/label.actions';
import { LabelState, initialState } from './../states/label.state';

import { LabelModel } from './../models/label.model';

export type Action = LabelActions.All;

export const LabelReducer: ActionReducer<LabelState> = (state = initialState, action: Action) => {
  switch(action.type) {
    case LabelActions.GET_SUCCESS: {
      return [...action.payload];
    }
    case LabelActions.GET_ERROR: {
      return state;
    }
    case LabelActions.ADD_SUCCESS: {
      return [action.payload, ...state];
    }
    case LabelActions.ADD_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
