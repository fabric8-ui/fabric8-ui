import { AreaUI } from './../models/area.model';

export interface AreaState {
  [index: number]: AreaUI;
}

export const initialState: AreaState = [] as AreaState;
