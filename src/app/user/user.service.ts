import { MockHttp } from './../shared/mock-http';
import Globals = require('./../shared/globals');

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Logger } from '../shared/logger.service';
import { Broadcaster } from '../shared/broadcaster.service';

import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../models/user';

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private userUrl = process.env.API_URL + 'user';  // URL to web api
  private identitiesUrl = process.env.API_URL + 'identities';  // URL to web api
  userData: User = {} as User;
  allUserData: User[] = [];

  constructor(private http: Http,
              private logger: Logger,
              private auth: AuthenticationService,
              private broadcaster: Broadcaster) {

    if (Globals.inTestMode) {
      logger.log('UserService running in ' + process.env.ENV + ' mode.');
      this.http = new MockHttp(logger);
    } else {
      logger.log('UserService running in production mode.');
    }
    logger.log('UserService using user url ' + this.userUrl + ' identity url ' + this.identitiesUrl);

    this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.resetUser();
    });
  }

  getSavedLoggedInUser(): User {
    return this.userData;
  }

  getLocallySavedUsers(): User[] {
    return this.allUserData;
  }

  getUser(): Promise<User> {
    if (Object.keys(this.userData).length || !this.auth.isLoggedIn()) {
      return new Promise((resolve, reject) => {
        resolve(this.userData);
      });
    } else {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
        return this.http
          .get(this.userUrl, {headers: this.headers})
          .toPromise()
          .then(response => {
            let userData = response.json().data as User;
            // The reference of this.userData is 
            // being used in Header
            // So updating the value like that
            this.userData.attributes = {
              fullName: userData.attributes.fullName,
              imageURL: userData.attributes.imageURL
            };
            this.userData.id = userData.id;
            return this.userData;
          })
          .catch (this.handleError);
    }
  }

  getAllUsers(): Promise<User[]> {
    if (this.allUserData.length) {
      return new Promise((resolve, reject) => {
        resolve(this.allUserData);
      });
    } else {
      return this.http
          .get(this.identitiesUrl, {headers: this.headers})
          .toPromise()
          .then(response => {
            this.allUserData = response.json().data as User[]; 
            return this.allUserData;
          })
          .catch(this.handleError);
    }
  }

  resetUser(): void {
    this.userData = {} as User;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
