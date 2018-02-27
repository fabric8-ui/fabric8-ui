import {
    Component,
    Input,
    ViewEncapsulation
} from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../states/app.state';
import { WorkItemUI } from '../../models/work-item';
import * as CommentActions from './../../actions/comment.actions';
import { User } from 'ngx-login-client';
import { CommentState } from '../../states/comment.state';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'work-item-comment-wrapper',
    templateUrl: './work-item-comment-wrapper.component.html',
})
  
export class WorkItemCommentWrapperComponent {
    @Input() workItem: WorkItemUI;
    @Input() loggedIn: Boolean;
    @Input() loggedInUser: User;
    
    comments: CommentState = [];

    private commentSource = this.store
    .select('detailPage')
    .select('comments');

    constructor(private store: Store<AppState>) {}
    
    getComments(){
        this.commentSource.subscribe(comments => this.comments = comments);
    }

    createComment(event: any) {
        const payload = {
          url: this.workItem.commentLink,
          comment: event
        };
        this.store.dispatch(new CommentActions.Add(payload));
        this.getComments();
    }
    
    updateComment(comment) {
        this.store.dispatch(new CommentActions.Update(comment));
        this.getComments();
    }
    
    deleteComment(event: any) {
        this.store.dispatch(new CommentActions.Delete(event));
        this.getComments();
    }
}
  