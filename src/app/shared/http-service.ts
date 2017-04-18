import {
  Inject,
  Injectable,
  ReflectiveInjector,
  forwardRef
} from '@angular/core';

import {
  Http,
  XHRBackend,
  RequestOptions,
  Request,
  RequestOptionsArgs,
  Response,
  Headers
} from '@angular/http';

import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

/**
 * This class is an abstract of Angular2 HTTP
 * Extended from Angular2 HTTP
 *
 * Purpose:
 * Error handling on API services
 * To implement a general retry logic
 */

@Injectable()
export class HttpService extends Http {

  private headers = new Headers({'Content-Type': 'application/json'});
  constructor (
    backend: any,
    options: RequestOptions,
    auth: AuthenticationService
  ) {
    super(backend, options);
    if (auth && auth.getToken() != null) {
      this.headers.set('Authorization', `Bearer ${auth.getToken()}`);
    }
  }

  get(url: string, options = {}) {
    console.log('GET request initiated');
    console.log('URL - ', url);
    console.log('Options - ', options);
    return super.get(url, { headers: this.headers });
  }

  post(url: string, body: any, options: RequestOptionsArgs = {}) {
    options = Object.assign(options, this.options);
    console.log('POST request initiated');
    console.log('URL - ', url);
    console.log('Body - ', body);
    console.log('Options - ', options);
    return super.post(url, body, { headers: this.headers });
  }

  put(url: string, body: any, options: RequestOptionsArgs = {}) {
    console.log('PUT request initiated');
    console.log('URL - ', url);
    console.log('Body - ', body);
    console.log('Options - ', options);
    return super.put(url, body, { headers: this.headers });
  }

  patch(url: string, body: any, options: RequestOptionsArgs = {}) {
    console.log('PATCH request initiated');
    console.log('URL - ', url);
    console.log('Body - ', body);
    console.log('Options - ', options);
    return super.patch(url, body, { headers: this.headers });
  }

  delete(url: string, options: RequestOptionsArgs = {}) {
    console.log('DELETE request initiated');
    console.log('URL - ', url);
    console.log('Options - ', options);
    return super.delete(url, { headers: this.headers });
  }

}
