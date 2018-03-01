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
import { CommentUI } from './../../models/comment';
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
  private comments: CommentUI[] = [];
  private eventListeners: any[] = [];

  private spaceSource = this.store
    .select('listPage')
    .select('space')
    .filter(s => !!s);
  private collaboratorSource = this.store
    .select('listPage')
    .select('collaborators')
    .filter(c => !!c.length);
  private commentSource = this.store
    .select('detailPage')
    .select('comments');

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    Observable.combineLatest(
      this.spaceSource,
      this.collaboratorSource
    ).take(1).subscribe(([
      spaceSource,
      collaboratorSource,
    ]) => {
      this.eventListeners.push(
        this.commentSource.subscribe(comments => {
          this.comments = [...comments];
        })
      )
    })
  }

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
