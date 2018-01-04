import { State, ActionReducer } from '@ngrx/store';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemState, initialState } from './../states/work-item.state';
import { cloneDeep } from 'lodash';

import { WorkItem } from './../models/work-item';

export type Action = WorkItemActions.All;

export const WorkItemReducer: ActionReducer<WorkItemState> = (state = initialState, action: Action) => {
  switch(action.type) {
    case WorkItemActions.GET_SUCCESS: {
      return {
        workItems: cloneDeep(action.payload)
      }
    }
    case WorkItemActions.GET_ERROR: {
      return state;
    }
    case WorkItemActions.ADD_SUCCESS: {
      return {
        workItems: [...[action.payload], ...state.workItems]
      }
    }
    case WorkItemActions.ADD_ERROR: {
      return state;
    }
    case WorkItemActions.UPDATE_SUCCESS: {
      let updatedWorkItem = action.payload;
      let index = state.workItems.findIndex(wi => wi.id === updatedWorkItem.id);
      if (index > -1) {
        state.workItems[index] = action.payload;
      }
      return {
        workItems: state.workItems
      }
    }
    case WorkItemActions.UPDATE_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
