import { SpaceState } from './space.state';
import { GroupTypeState } from './grouptype.state';
import { IterationState } from './iteration.state';
import { LabelState } from './label.state';
import { AreaState } from './area.state';
import { CollaboratorState } from './collaborator.state';
import { CommentState } from './comment.state';

export interface AppState {
  listPage?: {
    iterations: IterationState,
    labels: LabelState,
    areas: AreaState,
    collaborators: CollaboratorState,
    groupTypes: GroupTypeState,
    space: SpaceState
    comments: CommentState
  };
};
