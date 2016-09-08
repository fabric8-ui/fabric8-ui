import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '../shared/logger.service';

@Injectable()
export class AuthenticationService {
  private authToken: string = '';

  constructor(private router: Router, private logger: Logger) {
    
  }

  isLoggedIn(): Boolean {
    let token = localStorage.getItem('auth_token');
    if (token){
      this.authToken = token;
      return true;      
    }
    let params = this.getUrlParams();
    if ('token' in params) {
      this.authToken = params['token'];
      localStorage.setItem('auth_token', this.authToken);
      return true;
    }
    //this.router.navigate(['login']);
    return false;
  }

  logout() {
    this.authToken = '';
    localStorage.removeItem('auth_token');
    //this.router.navigate(['login']);
    location.href = location.protocol + '//' + location.host + location.pathname + location.hash;
  }

  getToken() {
    if (this.authToken) return this.authToken;
    //else this.router.navigate(['login']);
  }

  getUrlParams(): Object {
    var query = window.location.search.substr(1);
    var result = {};
    query.split('&').forEach(function(part) {
      var item = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }
}
