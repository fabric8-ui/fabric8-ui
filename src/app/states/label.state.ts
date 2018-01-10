import { LabelModel } from './../models/label.model';

export interface LabelState {
  [index: number]: LabelModel;
};

export const initialState = [] as LabelState;
