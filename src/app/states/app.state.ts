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
    workItemTypes: states.WorkItemTypeState
    workItemStates: states.WIState
  };

  iterationPanel: {
    iterationUI: states.IterationUIState
  };

  detailPage: {
    comments: states.CommentState
  };

  toolbar: {
    filters: states.FilterState
  };
};
