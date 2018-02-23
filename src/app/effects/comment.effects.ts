import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CommentActions from './../actions/comment.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import {
  CommentService,
  CommentMapper,
  CommentUI,
  CommentCreatorResolver
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
    .withLatestFrom(this.store.select('listPage').select('collaborators'))
    .map(([action, collaborators]) => {
      return {
        payload: action.payload,
        collaborators: collaborators
      }
    })
    .switchMap((cp) => {
      const payload = cp.payload;
      const collaborators = cp.collaborators;
      return this.workItemService.resolveComments(payload)
        .map((comments) => {
          return comments.data.map(comment => {
            const cMapper = new CommentMapper(this.userMapper);
            const commentUI = cMapper.toUIModel(comment);
            const creatorResolver = new CommentCreatorResolver(commentUI);
            creatorResolver.resolveCreator(collaborators);
            return creatorResolver.getComment();
          })
        })
        .map((comments: CommentUI[]) => {
          return new CommentActions.GetSuccess(
            comments
          )
        })
    })

  @Effect() addComment$: Observable<Action> = this.actions$
    .ofType<CommentActions.Add>(CommentActions.ADD)
    .withLatestFrom(this.store.select('listPage').select('collaborators'))
    .map(([action, collaborators]) => {
      return {
        payload: action.payload,
        collaborators: collaborators
      }
    })
    .switchMap(cp => {
      const payload = cp.payload;
      const collaborators = cp.collaborators;
      return this.workItemService.createComment(payload.url, payload.comment)
        .map((comment) => {
          const cMapper = new CommentMapper(this.userMapper);
          const commentUI = cMapper.toUIModel(comment);
          const creatorResolver = new CommentCreatorResolver(commentUI);
          creatorResolver.resolveCreator(collaborators);
          return new CommentActions.AddSuccess(
            creatorResolver.getComment()
          );
        })
    })

  @Effect() updateComment$: Observable<Action> = this.actions$
    .ofType<CommentActions.Update>(CommentActions.UPDATE)
    .withLatestFrom(this.store.select('listPage').select('collaborators'))
    .map(([action, collaborators]) => {
      return {
        payload: action.payload,
        collaborators: collaborators
      }
    })
    .switchMap((cp) => {
      const payload = cp.payload;
      const collaborators = cp.collaborators;
      const cMapper = new CommentMapper(this.userMapper);
      const comment = cMapper.toServiceModel(payload);
      return this.workItemService.updateComment(comment)
        .map((comment: CommentService) => {
          const cMapper = new CommentMapper(this.userMapper);
          const commentUI = cMapper.toUIModel(comment);
          const creatorResolver = new CommentCreatorResolver(commentUI);
          creatorResolver.resolveCreator(collaborators);
          return new CommentActions.UpdateSuccess(
            creatorResolver.getComment()
          );
        })
    })

  @Effect() deleteComment$: Observable<Action> = this.actions$
    .ofType<CommentActions.Delete>(CommentActions.DELETE)
    .map(action => action.payload)
    .switchMap((payload) => {
      const cMapper = new CommentMapper(this.userMapper);
      const comment = cMapper.toServiceModel(payload);
      return this.workItemService.deleteComment(comment)
        .map(() => {
          const cMapper = new CommentMapper(this.userMapper);
          return new CommentActions.DeleteSuccess(payload);
        })
    })
}
