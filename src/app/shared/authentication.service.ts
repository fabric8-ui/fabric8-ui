import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../shared/logger.service';
import { Broadcaster } from '../shared/broadcaster.service';

@Injectable()
export class AuthenticationService {
  private authToken: string = '';

  constructor(private router: Router,
              private logger: Logger,
              private broadcaster: Broadcaster) {

  }

  isLoggedIn(): boolean {
    let token = localStorage.getItem('auth_token');
    if (token) {
      this.authToken = token;
      return true;
    }
    let params = this.getUrlParams();
    if ('token' in params) {
      this.authToken = params['token'];
      localStorage.setItem('auth_token', this.authToken);
      return true;
    }
    return false;
  }

  logout() {
    this.authToken = '';
    localStorage.removeItem('auth_token');
    this.broadcaster.broadcast('logout', 1);
  }

  getToken() {
    if (this.isLoggedIn()) return this.authToken;
  }

  getUrlParams(): Object {
    let query = window.location.search.substr(1);
    let result = {};
    query.split('&').forEach(function(part) {
      let item = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }
}
