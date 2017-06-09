import { Observable } from 'rxjs';
import { CommentLink } from '../../models/comment';

import {
    OnInit, OnChanges,
    Component, ViewChild,
    EventEmitter, Input, Output
} from '@angular/core';

import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { User } from 'ngx-login-client';

import { Comment, CommentAttributes } from '../../models/comment';
import { WorkItem } from '../../models/work-item';
import { CollaboratorService } from '../../services/collaborator.service';

@Component({
    selector: 'alm-work-item-comment',
    templateUrl: './work-item-comment.component.html',
    styleUrls: ['./work-item-comment.component.scss'],
})
export class WorkItemCommentComponent implements OnInit {
    @Input() loadingComments: boolean = true;
    @Input() comments: Comment[];
    @Input() loggedIn: Boolean;
    @Input() loggedInUser: User;
    @Output() create = new EventEmitter<Comment>();
    @Output() update = new EventEmitter<Comment>();
    @Output() delete = new EventEmitter<Comment>();
    @ViewChild('deleteCommentModal') deleteCommentModal: any;
    comment: Comment;
    isCollapsedComments: Boolean = false;
    commentEditable: Boolean = false;
    selectedCommentId: String = '';
    convictedComment: Comment;

    constructor(
        private router: Router,
        http: Http
    ) {
    }

    ngOnInit() {
        this.createCommentObject();
    }

    ngAfterViewInit() {
        let commentbox = document.querySelector("#wi-comment-add-comment") as HTMLParagraphElement;
        if (!!commentbox) {
            commentbox.textContent = commentbox.dataset['placeholder'];
            commentbox.blur();
        }
    }

    createCommentObject(): void {
        this.comment = new Comment();
        this.comment.type = 'comments';
        this.comment.attributes = new CommentAttributes();
        this.comment.links = new CommentLink();
    };

    openComment(id): void {
      if (this.loggedIn) {
        this.selectedCommentId = id;
        this.commentEditable = true;
      }
    }

    createComment(event: any = null): void {
      this.preventDef(event);
      this.comment.attributes.body = event.target.textContent;
      this.create.emit(this.comment);
      event.target.textContent = '';
      this.createCommentObject();
    }

    updateComment(val: string, comment: Comment): void {
      let newCommentBody = document.getElementById(val).innerHTML;
      comment.attributes.body = newCommentBody;

      this.update.emit(comment);
      this.selectedCommentId = '';
      this.createCommentObject();
    }

    confirmCommentDelete(comment: Comment): void {
        this.deleteCommentModal.open();
        this.convictedComment = comment;
    }

    deleteComment(): void {
        this.delete.emit(this.convictedComment);
        this.deleteCommentModal.close();
        this.createCommentObject();
    }

    onCommentEdit($event, inpId, saveBtnId) {
      this.preventDef($event);
      // console.log(document.getElementById(saveBtnId).cla);
      if (document.getElementById(inpId).innerHTML.trim() === '') {
        document.getElementById(saveBtnId).classList.add('disabled');
      } else {
        document.getElementById(saveBtnId).classList.remove('disabled');
      }
    }

    closeCommentEditing() {
      this.selectedCommentId = '';
    }

    resetCommentDraft(event: any = null): void {
        let commentbox  = event.target,
            placeholder = event.target.dataset.placeholder;

        if (event.type === 'focus' && commentbox.textContent === placeholder) {
            commentbox.classList.remove("placeholder");
            commentbox.textContent = '';
        } else if (event.type === 'blur' && commentbox.textContent === '') {
            commentbox.classList.add("placeholder");
            commentbox.textContent = placeholder;
        }
    }

    preventDef(event: any) {
        event.preventDefault();
    }
}
