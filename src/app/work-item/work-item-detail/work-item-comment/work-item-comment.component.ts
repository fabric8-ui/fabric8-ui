import { Observable } from 'rxjs';
import { CommentLink } from './../../../models/comment';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { remove } from 'lodash';

import {
    User,
    UserService
} from 'ngx-login-client';

import { Comment, CommentAttributes } from '../../../models/comment';
import { WorkItem } from '../../../models/work-item';
import { WorkItemService } from '../../work-item.service';
import { CollaboratorService } from './../../../collaborator/collaborator.service';

@Component({
    selector: 'alm-work-item-comment',
    templateUrl: './work-item-comment.component.html',
    styleUrls: ['./work-item-comment.component.scss'],
})
export class WorkItemCommentComponent implements OnInit, OnChanges {
    @Input() workItem: WorkItem;
    @Input() loggedIn: Boolean;
    @ViewChild('deleteCommentModal') deleteCommentModal: any;
    comment: Comment;
    users: User[];
    isCollapsedComments: Boolean = false;
    currentUser: User;
    commentEditable: Boolean = false;
    selectedCommentId: String = '';
    convictedComment: Comment;

    constructor(
        private workItemService: WorkItemService,
        private router: Router,
        private userService: UserService,
        private collaboratorService: CollaboratorService,
        http: Http
    ) {
    }

    ngOnInit() {
        this.currentUser = this.userService.getSavedLoggedInUser();
        this.createCommentObject();
    }

    ngAfterViewInit() {
        let commentbox = document.querySelector("#wi-comment-add-comment") as HTMLParagraphElement;
        if (!!commentbox) {
            commentbox.textContent = commentbox.dataset['placeholder'];
            commentbox.blur();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
      this.collaboratorService.getCollaborators()
      .subscribe((users) => {
        this.workItem.relationships.comments.data =
          this.workItem.relationships.comments.data.map((comment) => {
            comment.relationships['created-by'].data =
              users.find(user => user.id === comment.relationships['created-by'].data.id);
            return comment;
          });
      });
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
      this.workItemService
        .createComment(this.workItem.relationships.comments.links.related, this.comment)
        .switchMap((comment: Comment) => {
          return this.collaboratorService.getCollaborators()
            .map((users) => {
              comment.relationships['created-by'].data =
                users.find(user => user.id === comment.relationships['created-by'].data.id);
              return comment;
            });
        })
        .subscribe((comment: Comment) => {
            if (typeof(this.workItem.relationships.comments.data) === 'undefined') {
              this.workItem.relationships.comments = Object.assign(
                this.workItem.relationships.comments,
                { data: [] }
              );
            }
            this.workItem.relationships.comments.data.splice(0, 0, comment);
            this.workItem.relationships.comments.meta.totalCount += 1;
            event.target.textContent = '';
            this.createCommentObject();
        },
        (error) => {
            console.log(error);
        });
    }

    updateComment(val: string, comment: Comment): void {
      let newCommentBody = document.getElementById(val).innerHTML;
      comment.attributes.body = newCommentBody;
      this.workItemService
        .updateComment(comment)
          .subscribe(response => {
            //event.target.blur();
            this.selectedCommentId = '';
            this.createCommentObject();
          },
          (error) => {
            console.log(error);
          });
    }

    confirmCommentDelete(comment: Comment): void {
        this.deleteCommentModal.open();
        this.convictedComment = comment;
    }

    deleteComment(): void {
        this.workItemService
            .deleteComment(this.convictedComment)
            .subscribe(response => {
                if (response.status === 200) {
                    remove(this.workItem.relationships.comments.data, comment => {
                        if (!!this.convictedComment) {
                            return comment.id == this.convictedComment.id;
                        }
                    });
                }
            }, err => console.log(err));

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
