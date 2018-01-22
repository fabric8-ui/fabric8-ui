import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';

import { WorkItemTypeState, initialState } from '../states/work-item-type.state';

export type Action = WorkItemTypeActions.All;

export const WorkItemTypeReducer: ActionReducer<WorkItemTypeState> =
  (state = initialState, action: Action) => {
    switch(action.type) {
      case WorkItemTypeActions.GET_SUCCESS: {
        return action.payload;
      }

      case WorkItemTypeActions.GET_ERROR: {
        return state;
      }

      default: {
        return state;
      }
    }
  }
