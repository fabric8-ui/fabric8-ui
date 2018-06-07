import { createEntityAdapter } from '@ngrx/entity';
import { State, ActionReducer } from '@ngrx/store';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemState, initialState } from './../states/work-item.state';
import { cloneDeep } from 'lodash';

import { WorkItem, WorkItemUI, WorkItemStateModel } from './../models/work-item';

export type Action = WorkItemActions.All;
const workItemAdapter = createEntityAdapter<WorkItemUI>();

export const WorkItemReducer: ActionReducer<WorkItemState> = (state = initialState, action: Action) => {
  switch(action.type) {

    case WorkItemActions.ADD_SUCCESS: {
      let newState = {...state};
      if (action.payload.parentID && state.entities[action.payload.parentID]) {
        newState.entities[action.payload.parentID].hasChildren = true;
        newState.entities[action.payload.parentID].childrenLoaded = true;
        newState.entities[action.payload.parentID].treeStatus = 'expanded';
      }
      newState = workItemAdapter.addOne(action.payload, newState);
      return {...newState};
    }

    case WorkItemActions.ADD_ERROR: {
      return state;
    }

    case WorkItemActions.GET_SUCCESS: {
      return workItemAdapter.addAll(action.payload, state);
    }

    case WorkItemActions.GET_ERROR: {
      return state;
    }

    case WorkItemActions.GET_CHILDREN_ERROR: {
      state.entities[action.payload.id].treeStatus = 'collapsed';
      return {...state};
    }

    case WorkItemActions.GET_CHILDREN_SUCCESS: {
      const newSTate = workItemAdapter.addMany(action.payload.children, state);
      if (newSTate.entities[action.payload.parent.id]) {
        newSTate.entities[action.payload.parent.id].childrenLoaded = true;
        newSTate.entities[action.payload.parent.id].treeStatus = 'expanded';
      }
      return {...newSTate};
    }

    case WorkItemActions.UPDATE_SUCCESS: {
      return workItemAdapter.updateOne({
        id: action.payload.id,
        changes: action.payload
      }, state)
    }

    case WorkItemActions.UPDATE_ERROR: {
      return {...state};
    }

    case WorkItemActions.CREATE_LINK: {
      let newState = {...state};
      if (action.payload.sourceTreeStatus === 'expanded') {
        if (newState.entities[action.payload.target.id]) {
          newState.entities[action.payload.target.id].parentID = action.payload.source.id;
        }
      } else if (action.payload.sourceTreeStatus === 'disabled') {
        if (newState.entities[action.payload.target.id] &&
          newState.entities[action.payload.source.id]) {
          newState.entities[action.payload.source.id].hasChildren = true;
          newState.entities[action.payload.source.id].treeStatus = 'collapsed';
          newState = workItemAdapter.removeOne(action.payload.target.id, newState);
        }
      }
      return {...newState};
    }

    case WorkItemActions.DELETE_LINK: {
      if (state.entities[action.payload.target.id]) {
        state.entities[action.payload.target.id].parentID = '';
      }
      return {...state};
    }

    default: {
      return state;
    }
  }
}
