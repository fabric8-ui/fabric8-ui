import { CommentLink } from './../../../models/comment';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import {
    User,
    UserService
} from 'ngx-login-client';

import { Comment, CommentAttributes } from '../../../models/comment';
import { WorkItem } from '../../../models/work-item';
import { WorkItemService } from '../../work-item.service';

@Component({
    selector: 'alm-work-item-comment',
    templateUrl: './work-item-comment.component.html',
    styleUrls: ['./work-item-comment.component.scss'],
})
export class WorkItemCommentComponent implements OnInit, OnChanges {
    @Input() workItem: WorkItem;
    @Input() loggedIn: Boolean;
    comment: Comment;
    users: User[];
    isCollapsedComments: Boolean = false;
    currentUser: User;
    commentEditable: Boolean = false;
    selectedCommentId: String = '';

    constructor(
        private workItemService: WorkItemService,
        private router: Router,
        private UserService: UserService,
        http: Http
    ) {
    }

    ngOnInit() {
        this.UserService.getAllUsers().then((users) => this.users = users);
        this.currentUser = this.UserService.getSavedLoggedInUser();
        this.createCommentObject();
    }

    ngAfterViewInit() {
        let commentbox = document.querySelector("#wi-comment-add-comment") as HTMLParagraphElement;

        if (!!commentbox) {
            commentbox.textContent = commentbox.dataset['placeholder'];
            commentbox.blur();
        }
    }

    ngOnChanges(changes: SimpleChanges) {}

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
        .createComment(this.workItem['id'], this.comment)
        .then(response => {
            event.target.textContent = '';
            this.createCommentObject();
        })
        .catch ((error) => {
            console.log(error);
        });
    }

    updateComment(val: string, comment: Comment): void {
      let newCommentBody = document.getElementById(val).innerHTML;
      comment.attributes.body = newCommentBody;
      this.workItemService
        .updateComment(comment)
          .then(response => {
            //event.target.blur();
            this.selectedCommentId = '';
            this.createCommentObject();
          })
        .catch ((error) => {
          console.log(error);
        });
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
