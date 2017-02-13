import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { LoginItem } from './login-item';

@Injectable()
export class LoginService {
  // private githubUrl = 'app/loginStatus';
  private githubUrl: string;  // URL to web api

  constructor(private http: Http) {
    this.githubUrl = process.env.API_URL;
    if (this.githubUrl.substr(this.githubUrl.length - 1, 1) !== '/') {
      this.githubUrl += '/';
    }
    this.githubUrl += 'login/authorize ';
  }

  gitHubSignIn() {
    window.location.href = this.githubUrl;
  }

}
