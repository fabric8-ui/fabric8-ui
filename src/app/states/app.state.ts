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
    workItemTypes: states.WorkItemTypeState,
    customQueries: states.CustomQueryState
  };

  iterationPanel: {
    iterationUI: states.IterationUIState
  };

  detailPage: {
    comments: states.CommentState,
    workItem: states.DetailWorkItemState,
    linkType: states.LinkTypeState,
    workItemLink: states.WorkItemLinkState
  };

  toolbar: {
    filters: states.FilterState
  };

  workItemLink: {
    workItems: states.WorkItemState
  }
};
