import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as CollaboratorActions from './../actions/collaborator.actions';
import { CollaboratorState, initialState } from './../states/collaborator.state';
import { cloneDeep } from 'lodash';

import { User } from 'ngx-login-client';

export type Action = CollaboratorActions.All;

export const CollaboratorReducer: ActionReducer<CollaboratorState> = (state = initialState, action: Action) => {
  switch(action.type) {
    case CollaboratorActions.GET_SUCCESS: {
      return {
        collaborators: cloneDeep(action.payload)
      }
    }
    case CollaboratorActions.GET_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
