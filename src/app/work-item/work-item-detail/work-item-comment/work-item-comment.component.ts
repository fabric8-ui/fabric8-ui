import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { Comment, CommentAttributes } from '../../../models/comment';
import { User } from '../../../models/user';
import { UserService } from '../../../user/user.service';
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

    constructor(
        private workItemService: WorkItemService,
        private router: Router,
        private UserService: UserService,
        http: Http
    ) {
    }

    ngOnInit() {
        this.UserService.getAllUsers().then((users) => this.users = users);
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
    };

    createComment(event: any = null): void {
        this.preventDef(event);
        this.comment.attributes.body = event.target.textContent;
        this.workItemService
            .createComment(this.workItem['id'], this.comment)
            .then(response => {
                event.target.textContent = "";
                this.createCommentObject();
            })
            .catch ((error) => {
                console.log(error);
            });
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
