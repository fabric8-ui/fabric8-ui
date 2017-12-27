import { LabelModel } from './../models/label.model';

export interface LabelState {
  labels: LabelModel[];
  newLabel: LabelModel;
};

export const initialState: LabelState = {
  labels: [],
  newLabel: null
}
