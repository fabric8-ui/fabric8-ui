import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CommentActions from './../actions/comment.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import {
  CommentService,
  CommentMapper
} from './../models/comment';
import { UserMapper } from './../models/user';
import { CommentState } from './../states/comment.state';

export type Action = CommentActions.All;

@Injectable()
export class CommentEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>,
    private userMapper: UserMapper
  ) {}

  @Effect() getWorkItemComments$: Observable<Action> = this.actions$
    .ofType<CommentActions.Get>(CommentActions.GET)
    .map(action => action.payload)
    .switchMap((action) => {
      return this.workItemService.resolveComments(action.payload)
        .map((comments: CommentService[]) => {
          const cMapper = new CommentMapper(this.userMapper);
          return new CommentActions.GetSuccess(
            comments.map(c => cMapper.toUIModel(c))
          )
        })
    })

  @Effect() addComment$: Observable<Action> = this.actions$
    .ofType<CommentActions.Add>(CommentActions.ADD)
    .map(action => action.payload)
    .switchMap((payload) => {
      return this.workItemService.createComment(payload.url, payload.comment)
        .map((comment: CommentService) => {
          const cMapper = new CommentMapper(this.userMapper);
          return new CommentActions.AddSuccess(
            cMapper.toUIModel(comment)
          );
        })
    })

  @Effect() updateComment$: Observable<Action> = this.actions$
    .ofType<CommentActions.Update>(CommentActions.UPDATE)
    .map(action => action.payload)
    .switchMap((payload) => {
      return this.workItemService.updateComment(payload)
        .map((comment: CommentService) => {
          const cMapper = new CommentMapper(this.userMapper);
          return new CommentActions.UpdateSuccess(
            cMapper.toUIModel(comment)
          );
        })
    })

  @Effect() deleteComment$: Observable<Action> = this.actions$
    .ofType<CommentActions.Delete>(CommentActions.DELETE)
    .map(action => action.payload)
    .switchMap((payload) => {
      return this.workItemService.deleteComment(payload)
        .map(() => {
          const cMapper = new CommentMapper(this.userMapper);
          return new CommentActions.DeleteSuccess(
            cMapper.toUIModel(payload)
          );
        })
    })
}
