import { recommenderApiUrlProvider } from './../../shared/recommender-api.provider';
import { witApiUrlProvider } from './../../shared/wit-api.provider';
import { authApiUrlProvider } from './../../shared/auth-api.provider';
import { ssoApiUrlProvider } from './../../shared/sso-api.provider';
import { AuthenticationService } from 'ngx-login-client';
import { Navigation } from './../models/navigation';
import { ContextService } from './context.service';
import { Observable, ConnectableObservable, Subject, BehaviorSubject } from 'rxjs';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  NavigationEnd,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

// TODO HACK Replace with token injection
import {
  OnLogin,
  OAuthConfigStore,
  APIsStore,
  LoginService
} from 'fabric8-runtime-console';

// A resolver which can ensure the runtime console is properly logged in
@Injectable()
export class RuntimeConsoleResolver implements Resolve<Context> {

  constructor(
    private apiStore: APIsStore,
    private onLogin: OnLogin,
    private oauthConfigStore: OAuthConfigStore,
    private authService: AuthenticationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.apiStore.load();
    return this.apiStore.loading.distinctUntilChanged().filter(flag => (!flag))
      .switchMap(() => this.authService.getOpenShiftToken())
      .switchMap(token =>
        this.oauthConfigStore.resource.map(config => {
          if (config.loaded) {
            this.onLogin.onLogin(token);
          }
          return config.loaded;
        })
      ).skipWhile(val => (!val)).first();
  }

}

// TODO HACK Replace with openshift token injection
export let runtimeConsoleLoginProviders = [
  RuntimeConsoleResolver,
  LoginService,
  OnLogin,
  APIsStore,
  OAuthConfigStore,
  // Override any URL providers that Fabric8-runtime-console has incorrectly installed
  ssoApiUrlProvider,
  authApiUrlProvider,
  witApiUrlProvider,
  recommenderApiUrlProvider
];
