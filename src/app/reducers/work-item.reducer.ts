import { State, ActionReducer } from '@ngrx/store';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemState, initialState } from './../states/work-item.state';
import { cloneDeep } from 'lodash';

import { WorkItem } from './../models/work-item';

export type Action = WorkItemActions.All;

export const WorkItemReducer: ActionReducer<WorkItemState> = (state = initialState, action: Action) => {
  switch(action.type) {

    case WorkItemActions.ADD_SUCCESS: {
      return [action.payload, ...state];
    }

    default: {
      return state;
    }
  }
}
