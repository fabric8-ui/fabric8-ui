import { IterationModel } from './../models/iteration.model';

export interface IterationState {
  [index: number]: IterationModel
};

export const initialState: IterationState = [] as IterationState;
