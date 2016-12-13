import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { Comment, CommentAttributes } from '../../../../models/comment';
import { NewUser } from '../../../../user/user';
import { UserService } from '../../../../user/user.service';
import { WorkItem } from '../../../../models/work-item';
import { WorkItemService } from '../../../work-item.service';


@Component({
    selector: 'alm-work-item-comment',
    templateUrl: './work-item-comment.component.html',
    styleUrls: ['./work-item-comment.component.scss'],
})
export class WorkItemCommentComponent implements OnInit, OnChanges {
    @Input() workItem: WorkItem;
    @Input() loggedIn: Boolean;
    comment: Comment;
    users: NewUser[];

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

    ngOnChanges(changes: SimpleChanges) {}

    createCommentObject(): void {
        this.comment = new Comment();
        this.comment.type = 'comments';
        this.comment.attributes = new CommentAttributes();
    };

    createComment(event: any = null): void {
        this.preventDef(event);
        this.workItemService
            .createComment(this.workItem['id'], this.comment)
            .then(response => {
              this.createCommentObject();
            })
            .catch ((error) => {
                console.log(error);
            });
    }
    
    preventDef(event: any) {
        event.preventDefault();
    }
}
