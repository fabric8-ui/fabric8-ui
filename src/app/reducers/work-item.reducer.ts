import { State, ActionReducer } from '@ngrx/store';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemState, initialState } from './../states/work-item.state';
import { cloneDeep } from 'lodash';

import { WorkItem } from './../models/work-item';

export type Action = WorkItemActions.All;

export const WorkItemReducer: ActionReducer<WorkItemState> = (state = initialState, action: Action) => {
  console.log('####-0', action);
  switch(action.type) {

    case WorkItemActions.ADD_SUCCESS: {
      console.log('####-1', action);
      return [action.payload, ...state];
    }

    default: {
      return state;
    }
  }
}
