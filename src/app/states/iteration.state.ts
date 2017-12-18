import { IterationModel } from './../models/iteration.model';

export interface IterationState {
    iteration : IterationModel[];
  }
  
  export const initialState: IterationState = {
    iteration : []
  };
  