import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CommentActions from './../actions/comment.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';

export type Action = CommentActions.All;

@Injectable()
export class CommentEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>
  ) {}

  @Effect() getWorkItemComments$ = this.actions$
    .ofType<CommentActions.Get>(CommentActions.GET)
    .map(action => action.payload)
    .do(payload => {
      this.workItemService.resolveComments(payload)
        .subscribe(comments => {
          this.store.dispatch(new CommentActions.GetSuccess(comments));
        })
    })

  @Effect() addComment$ = this.actions$
    .ofType<CommentActions.Add>(CommentActions.ADD)
    .map(action => action.payload)
    .do(payload => {
      this.workItemService.createComment(payload.url, payload.comment)
        .subscribe(comment => {
          this.store.dispatch(new CommentActions.AddSuccess(comment));
        })
    })

  @Effect() updateComment$ = this.actions$
    .ofType<CommentActions.Update>(CommentActions.UPDATE)
    .map(action => action.payload)
    .do(payload => {
      this.workItemService.updateComment(payload)
        .subscribe(comment => {
          this.store.dispatch(new CommentActions.UpdateSuccess(comment));
        })
    })

  @Effect() deleteComment$ = this.actions$
    .ofType<CommentActions.Delete>(CommentActions.DELETE)
    .map(action => action.payload)
    .do(payload => {
      this.workItemService.deleteComment(payload)
        .subscribe(() => {
          this.store.dispatch(new CommentActions.DeleteSuccess(payload));
        })
    })
}
