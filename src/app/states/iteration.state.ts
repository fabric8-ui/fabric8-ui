import { IterationModel } from './../models/iteration.model';

export interface IterationState {
    iterations : IterationModel[];
  }
  
  export const initialState: IterationState = {
    iterations : []
  };
  