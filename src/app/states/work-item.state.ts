import { createEntityAdapter } from '@ngrx/entity';
import {
  WorkItemStateModel, WorkItemUI
} from './../models/work-item';

const workItemAdapter = createEntityAdapter<WorkItemUI>();


export const initialState: WorkItemStateModel =
  workItemAdapter.getInitialState();

export {
  WorkItemStateModel as WorkItemState
} from './../models/work-item';
