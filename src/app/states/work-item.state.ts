import { WorkItem } from './../models/work-item';

export interface WorkItemState {
  workItems: WorkItem[];
}

export const initialState: WorkItemState = {
  workItems: []
}
