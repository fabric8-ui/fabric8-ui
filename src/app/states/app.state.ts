import * as states from './index.state';

export interface AppState {
  listPage?: {
    iterations: states.IterationState,
    labels: states.LabelState,
    areas: states.AreaState,
    collaborators: states.CollaboratorState,
    workItems: states.WorkItemState,
    groupTypes: states.GroupTypeState,
    space: states.SpaceState
  };

  detailPage: {
    comments: states.CommentState
  };
};
