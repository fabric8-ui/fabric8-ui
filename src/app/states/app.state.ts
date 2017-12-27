import { IterationState } from './iteration.state';
import { LabelState } from './label.state';

export interface AppState {
  listPage: {
    iterations: IterationState,
    labels: LabelState
  };
};
