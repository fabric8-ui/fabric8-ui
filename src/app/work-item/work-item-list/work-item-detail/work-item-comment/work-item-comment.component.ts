import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { Comment, CommentAttributes } from '../../../../models/comment';
import { NewUser } from '../../../../user/user';
import { UserService } from '../../../../user/user.service';
import { WorkItem } from '../../../work-item';

import { WorkItemCommentService } from './work-item-comment.service';

@Component({
    selector: 'alm-work-item-comment',
    templateUrl: './work-item-comment.component.html',
    styleUrls: ['./work-item-comment.component.scss'],
})
export class WorkItemCommentComponent implements OnInit, OnChanges {
    @Input() workItem: WorkItem;
    @Input() loggedIn: Boolean;
    comments: Comment[];
    comment: Comment;
    users: NewUser[];

    constructor(
        private WorkItemCommentService: WorkItemCommentService,
        private router: Router,
        private UserService: UserService,
        http: Http
    ) {
    }

    ngOnInit() {
        this.UserService.getAllUsers().then((users) => this.users = users);
        this.createCommentObject();
        this.loadComments();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.loadComments();
    }

    createCommentObject(): void {
        this.comment = new Comment();
        this.comment.type = 'comments';
        this.comment.attributes = new CommentAttributes();
    };

    createComment(event: any = null): void {
        this.preventDef(event);
        this.WorkItemCommentService
            .createComment(this.workItem['id'], this.comment)
            .then(response => {
                this.comments.splice(0, 0, response);
                this.createCommentObject();
                this.resolveCreator(response);
            }).catch((error) => {
                console.log(error);
            });
    }

    loadComments(): void {
        this.WorkItemCommentService
            .getComments(this.workItem['id'])
            .then((response) => {
                this.comments = (response.data || new Array<Comment>()).sort((a, b) => { return b.attributes['created-at'].localeCompare(a.attributes['created-at']); });

                this.resolveCreators();
            }).catch(() => {
                console.log('Error in loading Link Types');
            });
    }

    resolveCreators(): void {
        this.comments.forEach(comment => {
            this.resolveCreator(comment);
        });
    }

    resolveCreator(comment: Comment): void {
        comment.relationships['created-by'].data = this.users.find((item) => item.id == comment.relationships['created-by'].data.id);
    }

    preventDef(event: any) {
        event.preventDefault();
    }
}
