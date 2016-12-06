import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from '../../../../auth/authentication.service';
import { Logger } from '../../../../shared/logger.service';
import { Comments, Comment, CommentPost } from '../../../../models/comment';


@Injectable()
export class WorkItemCommentService {
  private headers = new Headers({ 'Content-Type': 'application/vnd.api+json' });
  private workItemUrl = process.env.API_URL + 'workitems';  // URL to web api

  constructor(private http: Http,
    private logger: Logger,
    private auth: AuthenticationService) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    logger.log('WorkItemCommentService running in ' + process.env.ENV + ' mode.');
  }

  getComments(id: string): Promise<Comments> {
    return this.http
      .get(this.workItemUrl + '/' + id + '/relationships/comments', { headers: this.headers })
      .toPromise()
      .then((response) => process.env.ENV != 'inmemory' ? response.json() as Comments : response.json().data as Comments)
      .catch(this.handleError);
  }

  createComment(id: string, comment: Comment): Promise<Comment> {
    let c = new CommentPost();
    c.data = comment;

    return this.http
      .post(this.workItemUrl + '/' + id + '/relationships/comments', c, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as Comment)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}