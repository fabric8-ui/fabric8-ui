import { WorkItemService } from './../../services/work-item.service';
import { Observable } from 'rxjs';
import { CommentLink } from '../../models/comment';

import {
    OnInit, OnChanges,
    Component, ViewChild,
    EventEmitter, Input, Output
} from '@angular/core';

import { User } from 'ngx-login-client';

import { Comment, CommentAttributes } from '../../models/comment';
import { WorkItem } from '../../models/work-item';
import { CollaboratorService } from '../../services/collaborator.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'alm-work-item-comment',
    templateUrl: './work-item-comment.component.html',
    styleUrls: ['./work-item-comment.component.less'],
})
export class WorkItemCommentComponent implements OnInit {
    @Input() loadingComments: boolean = true;
    @Input() comments: Comment[];
    @Input() loggedIn: Boolean;
    @Input() loggedInUser: User;
    @Output() create = new EventEmitter<Comment>();
    @Output() update = new EventEmitter<Comment>();
    @Output() delete = new EventEmitter<Comment>();
    comment: Comment;
    isCollapsedComments: Boolean = false;
    commentEditable: Boolean = false;
    selectedCommentId: String = '';
    convictedComment: Comment;

    constructor(
        private workItemService: WorkItemService,
        private modalService: ModalService
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

    createComment(event): void {
      const rawText = event.rawText;
      const callBack = event.callBack;
      this.comment.attributes.body = rawText;
      this.comment.attributes.markup = 'Markdown';
      this.create.emit(this.comment);
      callBack('', '');
      this.createCommentObject();
    }

    showPreview(event: any): void {
      const rawText = event.rawText;
      const callBack = event.callBack;
      this.workItemService.renderMarkDown(rawText)
        .subscribe(renderedHtml => {
          callBack(
            rawText,
            renderedHtml
          );
        })
    }

    updateComment(event, comment): void {
      const rawText = event.rawText;
      const callBack = event.callBack;
      let newCommentBody = rawText;
      comment.attributes.body = newCommentBody;
      comment.attributes.markup = 'Markdown';
      this.workItemService
        .updateComment(comment)
        .subscribe(updatedComment => {
          this.update.emit(updatedComment);
          callBack(
            updatedComment.attributes.body,
            updatedComment.attributes['body.rendered']
          );
          this.createCommentObject();
        },
        (error) => {
          console.log(error);
        });
    }

    confirmCommentDelete(comment: Comment): void {
        this.convictedComment = comment;
        this.modalService.openModal('Delete Comment', 'Are you sure you want to delete this comment?', 'Delete', 'deleteComment')
            .subscribe(actionKey => {
                if (actionKey==='deleteComment')
                    this.deleteComment();
            });
    }

    deleteComment(): void {
        this.delete.emit(this.convictedComment);
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
