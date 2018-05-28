import { cloneDeep } from 'lodash';
import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs';

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
    this.commentQuery.dispatchGet(workItem.commentLink);
  }

  private workItem: WorkItemUI = null;
  private comments: Observable<CommentUI[]> =
    this.commentQuery.getCommentsWithChildren();
  private eventListeners: any[] = [];

  constructor(
    private commentQuery: CommentQuery
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  createComment(newComment: CommentUI) {
    this.commentQuery.createComment(
       this.workItem.commentLink,
       newComment
    );
  }

  updateComment(comment: CommentUI) {
    this.commentQuery.updateComment(comment);
  }

  deleteComment(event: any) {}
}
