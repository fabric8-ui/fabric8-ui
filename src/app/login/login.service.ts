import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { LoginItem } from './login-item';

@Injectable()
export class LoginService {
  // private githubUrl = 'app/loginStatus';
  private githubUrl = process.env.API_URL + 'login/authorize ';  // URL to web api

  constructor(private http: Http) {
  }

  gitHubSignIn(){
    window.location.href = this.githubUrl;
  }

}
