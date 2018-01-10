import { AreaUI } from './../models/area.model';

export interface AreaState {
  [index: number]: AreaModel;
}

export const initialState: AreaState = [] as AreaState;
