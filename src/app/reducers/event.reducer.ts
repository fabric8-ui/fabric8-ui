import { State, ActionReducer } from '@ngrx/store';
import * as EventActions from './../actions/event.action';
import { EventState, initialState } from '../states/event.state';

export type Action = EventActions.All;

export const EventReducer: ActionReducer<EventState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case EventActions.GET_SUCCESS: {
      return [...action.payload];
    }
    case EventActions.GET_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}