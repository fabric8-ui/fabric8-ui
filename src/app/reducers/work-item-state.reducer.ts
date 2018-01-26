import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as WIStateActions from './../actions/work-item-state.actions';
import {
  WIState,
  initialState
} from './../states/work-item-state.state';

export type Action = WIStateActions.All;

export const WorkItemStateReducer: ActionReducer<WIState> =
  (state = initialState, action: Action) => {
    switch(action.type) {
      case WIStateActions.GET_SUCCESS: {
        return action.payload[0].attributes.fields['system.state'].type.values;
      }

      case WIStateActions.GET_ERROR: {
        return state;
      }

      default: {
        return state;
      }
    }
  }
