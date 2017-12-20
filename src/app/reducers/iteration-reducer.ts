import * as IterationActions from '.././actions/iteration.actions';
import { State } from '@ngrx/store';
import { IterationModel } from './../models/iteration.model';
import { ActionReducer } from '@ngrx/store';
import { IterationState, initialState } from './../states/iteration.state';

export type Action = IterationActions.All;


export const iterationReducer : ActionReducer<IterationState> = ( state = initialState, action: Action) =>
{
    console.log('####-3', action);
    switch( action.type ) {
      case IterationActions.GET_SUCCESS:
           return {
             iterations : action.payload
           }

      case IterationActions.GET_ERROR:

      case IterationActions.ADD_SUCCESS:

      case IterationActions.ADD_ERROR:

      case IterationActions.UPDATE_SUCCESS:

      case IterationActions.UPDATE_ERROR:

      default:
          return state;
    }
  }
