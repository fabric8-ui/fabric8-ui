import { ActionReducer } from '@ngrx/store';
import * as  WorkItemActions  from '../actions/work-item.actions';
import { ColumnWorkItemState, InitialColumnWorkItemState } from '../states/index.state';


export type Action = WorkItemActions.All;

export const ColumnWorkItemReducer: ActionReducer<ColumnWorkItemState> = (state = InitialColumnWorkItemState, action: Action) => {
  switch (action.type) {
    case WorkItemActions.GET_SUCCESS: {
      const cwState = {...state};
      action.payload.forEach(item => {
        if (item.columnIds !== null) {
          item.columnIds.forEach(col => {
            if (cwState.hasOwnProperty(col)) {
              cwState[col] = [...cwState[col], item.id];
            } else {
              cwState[col] = [item.id];
            }
          });
        }
      });
      return {...cwState};
    }
    default:  {
      return {...state};
    }
  }
};
