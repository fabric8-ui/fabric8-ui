import { cloneDeep } from 'lodash';
import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import { WorkItemUI } from './../../models/work-item';
import { UserUI } from './../../models/user';
import { CommentUI, CommentQuery } from './../../models/comment';
import * as CommentActions from './../../actions/comment.actions';
import * as CollaboratorActions from './../../actions/collaborator.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'work-item-comment-wrapper',
  templateUrl: './work-item-comment-wrapper.component.html',
})

export class WorkItemCommentWrapperComponent implements OnInit, OnDestroy {
  @Input() loggedIn: boolean;
  @Input() loggedInUser: UserUI;
  @Input('workItem') set workItemSetter(workItem: WorkItemUI) {
    this.workItem = workItem;
    this.store.dispatch(new CommentActions.Get(workItem.commentLink));
  }

  private workItem: WorkItemUI = null;
  private comments: Observable<CommentUI[]> =
    this.commentQuery.getCommentsWithCreators();
  private eventListeners: any[] = [];

  constructor(
    private store: Store<AppState>,
    private commentQuery: CommentQuery
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  createComment(event: any) {
    const payload = {
      url: this.workItem.commentLink,
      comment: event
    };
    this.store.dispatch(new CommentActions.Add(payload));
  }

  updateComment(comment) {
    this.store.dispatch(new CommentActions.Update(comment));
  }

  deleteComment(event: any) {
    this.store.dispatch(new CommentActions.Delete(event));
  }
}
