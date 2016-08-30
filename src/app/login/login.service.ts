import { Injectable } from '@angular/core';
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { LoginItem } from './login-item';

@Injectable()
export class LoginService {
  // private githubUrl = 'app/loginStatus';
  private githubUrl = 'http://localhost:8081/api/login/authorize ';  // URL to web api


  constructor(private http: Http) { }

  gitHubSignIn(): Promise<any>  {
    return this.http
      .get(this.githubUrl)
      .toPromise()
      .then(response => response.json())
      // .then(response => response.json().data as {})
      .catch(this.handleError);
  }

  //Username + password login would require a post
  private post(loginItem: LoginItem): Promise<any> {
    let headers = new Headers({'Content-Type': 'application/json'});

    return this.http
      .post(this.githubUrl, JSON.stringify(loginItem), {headers: headers})
      .toPromise()
      .then(res => res.json() as {})
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
