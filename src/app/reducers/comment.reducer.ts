import { State, ActionReducer } from '@ngrx/store';
import * as CommentActions from './../actions/comment.actions';
import { CommentState, initialState } from './../states/comment.state';
import { cloneDeep } from 'lodash';

import { Comment } from './../models/comment';

export type Action = CommentActions.All;

export const CommentReducer: ActionReducer<CommentState> = (state = initialState, action: Action) => {
  switch(action.type) {
    case CommentActions.GET_SUCCESS: {
      return {
        comments: cloneDeep(action.payload)
      }
    }
    case CommentActions.GET_ERROR: {
      return state;
    }
    case CommentActions.ADD_SUCCESS: {
      return {
        comments: [...action.payload, ...state.comments]
      }
    }
    case CommentActions.ADD_ERROR: {
      return state;
    }
    case CommentActions.UPDATE_SUCCESS: {
      let updatedComment = action.payload;
      let index = state.comments.findIndex(c => c.id === updatedComment.id);
      if (index > -1) {
        state.comments[index] = action.payload
      }
      return {
        comments: state.comments
      }
    }
    case CommentActions.UPDATE_ERROR: {
      return state;
    }
    case CommentActions.DELETE_SUCCESS: {
      let deletedComment = action.payload;
      let index = state.comments.findIndex(c => c.id === deletedComment.id);
      if (index > -1) {
        state.comments.splice(index, 1);
      }
      return {
        comments: state.comments
      }
    }
    case CommentActions.DELETE_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
