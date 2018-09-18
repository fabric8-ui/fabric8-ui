import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GitHubDetails, GitProviderService, HelperService } from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';

import { ProviderService } from '../../../shared/account/provider.service';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable()
export class AppLauncherGitproviderService implements GitProviderService {

    private END_POINT: string = '';
    private API_BASE: string = 'services/git/';
    private ORIGIN: string = '';
    private PROVIDER: string = 'GitHub';
    private gitHubUserLogin: string;
    private headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-App': 'osio',
      'x-git-provider': this.PROVIDER
    });


    constructor(
      private http: HttpClient,
      private auth: AuthenticationService,
      private helperService: HelperService,
      private providerService: ProviderService
    ) {
      if (this.helperService) {
        this.END_POINT = this.helperService.getBackendUrl();
        this.ORIGIN = this.helperService.getOrigin();
      }
      if (this.auth.getToken() != null) {
        this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
      }
    }

  /**
   * Connect GitHub account
   *
   * @param {string} redirectUrl The GitHub redirect URL
   */
  connectGitHubAccount(redirectUrl: string): void {
    this.providerService.link('https://github.com', redirectUrl);
  }

  /**
   * Get GitHub repos associated with given user name
   *
   * @returns {Observable<any>}
   */
  private getGitHubUserData(): Observable<any> {
    let url = this.END_POINT + this.API_BASE + 'user';
    return this.http
      .get(url, { headers: this.headers })
      .catch((error: HttpErrorResponse) => {
        return Observable.throw(error);
      });
  }


   /**
   * Get GitHub Organizations associated with given user name
   *
   * @param userName The GitHub user name
   * @returns {Observable<any>}
   */
  getUserOrgs(userName: string): Observable<any> {
    let url = this.END_POINT + this.API_BASE + 'organizations';
    return this.http
      .get(url, { headers: this.headers })
      .catch((error: HttpErrorResponse) => {
        return Observable.throw(error);
      });
  }


  /**
   * Returns GitHub details associated with the logged in user
   *
   * @returns {Observable<GitHubDetails>} The GitHub details associated with the logged in user
   */
  getGitHubDetails(): Observable<GitHubDetails> {
    return this.getGitHubUserData().flatMap(user => {
      if (user && user.login) {
        let orgs = [];
        return this.getUserOrgs(user.login).flatMap(orgsArr => {
          if (orgsArr && orgsArr.length >= 0) {
            orgs = orgsArr;
            this.gitHubUserLogin = user.login;
            orgs.push(this.gitHubUserLogin);
            let gitHubDetails = {
              authenticated: true,
              avatar: user.avatarUrl,
              login: user.login,
              organizations: orgs,
              organization: user.login
            } as GitHubDetails;
            return Observable.of(gitHubDetails);
          } else {
            return Observable.empty();
          }
        });
      } else {
        return Observable.empty();
      }
    });
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @param {string} repoName The GitHub repos name (e.g., ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  isGitHubRepo(org: string, repoName: string): Observable<boolean> {
    let fullName = org + '/' + repoName;
    let url: string;
    if (this.gitHubUserLogin === org) {
      url = this.END_POINT + this.API_BASE + 'repositories';
    } else {
      url = this.END_POINT + this.API_BASE + 'repositories/?organization=' + org;
    }
    return this.http
      .get(url, { headers: this.headers })
      .map((resp: HttpResponse<any>) => {
        let repoList: string[] = resp as any;
        return repoList.indexOf(fullName) !== -1;
      })
      .catch((error: HttpErrorResponse) => {
        return Observable.throw(error);
      });
  }

  /**
   * Returns list 0f GitHub repos
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<any>} list of existing GitHub repos
   */
  getGitHubRepoList(org: string): Observable<any> {
    let url = this.END_POINT + this.API_BASE + 'repositories';
    let location = org + '/';
    if (this.gitHubUserLogin !== org) {
      url += '?organization=' + org;
    }
    return this.http
      .get(url, { headers: this.headers })
      .map((resp: HttpResponse<any>) => {
          let repoList = [];
          if (resp) {
            let responseList: string[] = resp as any;
            responseList.forEach(function(ele) {
              repoList.push(ele.replace(location, ''));
            });
          }
          return repoList;
        })
      .catch((error: HttpErrorResponse) => {
        return Observable.throw(error);
      });
  }

  // Private

  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private redirectToAuth(url: string) {
    window.location.href = url;
  }

  private handleError(error: HttpErrorResponse | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof HttpResponse) {
      const body = error.body || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
