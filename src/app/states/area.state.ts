import { AreaModel } from './../models/area.model';

export interface AreaState {
  areas: AreaModel[];
}

export const initialState: AreaState = {
  areas: []
}
