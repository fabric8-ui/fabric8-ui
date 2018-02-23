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

    case WorkItemActions.ADD_ERROR: {
      return [...state];
    }

    case WorkItemActions.GET_SUCCESS: {
      return action.payload;
    }

    case WorkItemActions.GET_ERROR: {
      return [...state];
    }

    case WorkItemActions.GET_CHILDREN_SUCCESS: {
      const parent = action.payload.parent;
      const children = action.payload.children;
      const parentIndex = state.findIndex(s => {
        return s.id === parent.id;
      });
      if (parentIndex) {
        state[parentIndex].childrenLoaded = true;
        state[parentIndex].treeStatus = 'expanded';
        return [...state, ...children];
      }
      return [...state];
    }

    default: {
      return state;
    }
  }
}
