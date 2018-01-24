import { cloneDeep } from 'lodash';
import * as IterationActions from '.././actions/iteration.actions';
import { State } from '@ngrx/store';
import { IterationModel } from './../models/iteration.model';
import { ActionReducer } from '@ngrx/store';
import {
  IterationState,
  initialState,
  IterationUIState,
  initialUIState
} from './../states/iteration.state';

export type Action = IterationActions.All;


export const iterationReducer: ActionReducer<IterationState> =
  ( state = initialState, action: Action) => {
    switch( action.type ) {
      case IterationActions.GET_SUCCESS:
        return action.payload

      case IterationActions.ADD_SUCCESS:
        const parent = action.payload.parent;
        const newIteration = action.payload.iteration;
        if (parent) {
          const parentIndex = state.findIndex(i => i.id === parent.id);
          if (parentIndex > -1) {
            state[parentIndex].hasChildren = true;
          }
        }
        return [ action.payload.iteration, ...state ];

      case IterationActions.UPDATE_SUCCESS:
        const updatedIteration = action.payload;
        const index = state.findIndex(i => i.id === updatedIteration.id);
        if (index > -1) {
          return [
            ...state.slice(0, index),
            updatedIteration,
            ...state.slice(index + 1)
          ]
        }
        return state;

      case IterationActions.GET_ERROR:

      case IterationActions.ADD_ERROR:

      case IterationActions.UPDATE_ERROR:

      default:
        return state;
    }
  }

export const iterationUiReducer: ActionReducer<IterationUIState> =
  ( state = initialUIState, action: Action) => {
    const newState = cloneDeep(state);
    switch( action.type ) {
      case IterationActions.UPDATE_SUCCESS:
      case IterationActions.ADD_SUCCESS:
        newState.error = '';
        newState.modalLoading = false;
        return newState;

      case IterationActions.UPDATE:
      case IterationActions.ADD:
        newState.error = '';
        newState.modalLoading = true;
        return newState;

      case IterationActions.ADD_ERROR:
        newState.modalLoading = false;
        newState.error = 'Some error has occured on adding iteration';
        return newState;

      case IterationActions.UPDATE_ERROR:
        newState.modalLoading = false;
        newState.error = 'Some error has occured on updating iteration';
        return newState;

      default:
        return newState;
    }
  }
