import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Logger } from '../shared/logger.service';

import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from '../auth/authentication.service';
import { User } from './user';

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private userUrl = process.env.API_URL + 'user';  // URL to web api

  constructor(private http: Http,
              private logger: Logger,
              private auth: AuthenticationService) {
  }

  getUser(): Promise<User> {
    this.headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    return this.http
      .get(this.userUrl, {headers: this.headers})
      .toPromise()
      .then(response => process.env.ENV != 'inmemory' ? response.json() as User : response.json().data as User)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
