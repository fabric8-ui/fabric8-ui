import {
  State,
  ActionReducer
} from '@ngrx/store';
import * as FilterActions from './../actions/filter.actions';
import {
  FilterState,
  initialState
} from '../states/filter.state';

export type Action = FilterActions.All;

export const FilterReducer: ActionReducer<FilterState> =
  (state = initialState, action: Action) => {
    switch(action.type) {
      case FilterActions.GET_SUCCESS: {
        return action.payload;
      }

      case FilterActions.GET_ERROR: {
        return [...state];
      }

      default: {
        return state;
      }
    }
  }
