import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Logger } from '../shared/logger.service';
import { Broadcaster } from './../shared/broadcaster.service';

import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from '../auth/authentication.service';
import { User, NewUser } from './user';

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private userUrl = process.env.API_URL + 'user';  // URL to web api
  private identitiesUrl = process.env.API_URL + 'identities';  // URL to web api
  userData: User;
  allUserData: NewUser[] = [];

  constructor(private http: Http,
              private logger: Logger,
              private auth: AuthenticationService,
              private broadcaster: Broadcaster) {

              this.broadcaster.on<string>('logout')
                  .subscribe(message => {
                    this.resetUser();
              });
  }

  getUser(): Promise<User> {
    if (this.userData) {
      return new Promise((resolve, reject) => {
        resolve(this.userData);
      });
    } else {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
        return this.http
          .get(this.userUrl, {headers: this.headers})
          .toPromise()
          .then(response => {
            this.userData = process.env.ENV != 'inmemory' ? response.json() as User : response.json().data as User;
            return this.userData;
          })
          .catch(this.handleError);
    }
  }

  getAllUsers(): Promise<NewUser[]> {
    if (this.allUserData.length) {
      return new Promise((resolve, reject) => {
        resolve(this.allUserData);
      });
    } else {
      return this.http
          .get(this.identitiesUrl, {headers: this.headers})
          .toPromise()
          .then(response => {
            this.allUserData = response.json().data as NewUser[]; 
            return this.allUserData;
          })
          .catch(this.handleError);
    }
  }

  resetUser(): void {
    this.userData = null as User;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
