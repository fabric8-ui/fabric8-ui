import { IterationState } from './iteration.state';
import { LabelState } from './label.state';
import { AreaState } from './area.state';
import { CollaboratorState } from './collaborator.state';

export interface AppState {
  listPage?: {
    iterations: IterationState,
    labels: LabelState,
    areas: AreaState,
    collaborators: CollaboratorState
  };
};
