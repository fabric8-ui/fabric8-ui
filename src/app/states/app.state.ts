import * as states from './index.state';

export interface AppState {
  listPage?: {
    iterations: IterationState,
    labels: LabelState,
    areas: AreaState,
    collaborators: CollaboratorState,
    groupTypes: GroupTypeState,
    space: SpaceState
  };

  detailPage: {
    comments: states.CommentState
  };
};
