import { State, ActionReducer } from '@ngrx/store';
import * as WorkItemActions from './../actions/detail-work-item.actions';
import { DetailWorkItemState, initialState } from './../states/detail-work-item.state';
import { cloneDeep } from 'lodash';

import { WorkItem } from './../models/work-item';

export type Action = WorkItemActions.All;

export const DetailWorkItemReducer: ActionReducer<DetailWorkItemState> = (state = initialState, action: Action) => {
  switch(action.type) {

    case WorkItemActions.GET_WORKITEM_SUCCESS: {
      return {...action.payload};
    }

    default: {
      return state;
    }
  }
}
