import {
  GroupTypeUI
} from './../models/group-types.model';

export interface GroupTypeState {
  [index: number]: GroupTypeUI
};

export const initialState: GroupTypeState = [] as GroupTypeState;
