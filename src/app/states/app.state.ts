import * as states from './index.state';

export interface AppState {
  listPage?: {
    iterations: states.IterationState,
    labels: states.LabelState,
    areas: states.AreaState,
    collaborators: states.CollaboratorState,
    workItems: states.WorkItemState,
    groupTypes: states.GroupTypeState,
    space: states.SpaceState,
    workItemStates: states.WIState,
    workItemTypes: states.WorkItemTypeState
  };

  iterationPanel: {
    iterationUI: states.IterationUIState
  };

  detailPage: {
    comments: states.CommentState,
    workItem: states.DetailWorkItemState
  };

  toolbar: {
    filters: states.FilterState
  };
};
