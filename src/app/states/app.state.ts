import { IterationState } from './iteration.state';
import { LabelState } from './label.state';
import { AreaState } from './area.state';

export interface AppState {
  listPage: {
    iterations: IterationState,
    labels: LabelState,
    areas: AreaState
  };
};
