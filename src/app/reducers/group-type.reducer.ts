import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as GroupTypeActions from './../actions/group-type.actions';
import { cloneDeep } from 'lodash';

import { GroupTypeState, initialState } from '../states/grouptype.state';

export type Action = GroupTypeActions.All;

export const GroupTypeReducer: ActionReducer<GroupTypeState> =
  (state = initialState, action: Action) => {
  switch(action.type) {
    case GroupTypeActions.GET_SUCCESS: {
      return action.payload;
    }
    case GroupTypeActions.GET_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
