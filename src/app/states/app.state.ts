import * as states from './index.state';

export interface AppState {
  listPage?: ListPage;

  iterationPanel: {
    iterationUI: states.IterationUIState
  };

  detailPage: {
    comments: states.CommentState,
    workItem: states.DetailWorkItemState,
    linkType: states.LinkTypeState,
    workItemLink: states.WorkItemLinkState,
    events: states.EventState
  };

  toolbar: {
    filters: states.FilterState
  };

  workItemLink: {
    workItems: states.WorkItemState
  }
};


export interface ListPage {
  iterations: states.IterationState,
  labels: states.LabelState,
  areas: states.AreaState,
  collaborators: states.CollaboratorState,
  users: states.UserState,
  workItems: states.WorkItemState,
  groupTypes: states.GroupTypeState,
  space: states.SpaceState,
  workItemStates: states.WIState,
  workItemTypes: states.WorkItemTypeState,
  customQueries: states.CustomQueryState,
  infotips: states.InfotipState
};
