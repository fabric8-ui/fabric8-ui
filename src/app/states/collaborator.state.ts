import { User } from 'ngx-login-client';

export interface CollaboratorState {
  collaborators: User[];
}

export const initialState: CollaboratorState = {
  collaborators: []
}
