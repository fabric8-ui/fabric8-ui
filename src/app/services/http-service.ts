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
    // We are not dealing with cache so random Etag value is sent
    // this.headers.set('If-None-Match', 'somerandomEtagValue');
  }

  get(url: string, options = {}) {
    console.log('GET request initiated');
    console.log('URL - ', url);
    console.log('Options - ', options);
    let retryCount = 1;
    return super.get(url, { headers: this.headers })
    .retryWhen(attempts => {
      console.log('retryWhen callback');
      let count = 0;
      return attempts.flatMap(error => {
        if (error.status == 0) { // Server offline :: keep trying
          console.log('########### Now offline #############', error);
          return Observable.timer(++count * 1000);
        } else if (error.status == 500){ // Server error :: Try 3 times then throw error
          return ++count >= 3 ? Observable.throw(error) : Observable.timer(1000);
        } else {
          return Observable.throw(error);
        }
      });
    });
  }

  post(url: string, body: any, options: RequestOptionsArgs = {}) {
    options = Object.assign(options, this.options);
    console.log('POST request initiated');
    console.log('URL - ', url);
    console.log('Body - ', body);
    console.log('Options - ', options);
    return super.post(url, body, { headers: this.headers })
    .retryWhen(attempts => {
      console.log('retryWhen callback');
      let count = 0;
      return attempts.flatMap(error => {
        if (error.status == 0) {
          console.log('########### Now offline #############', error);
          return Observable.timer(++count * 1000);
        } else if (error.status == 500){
          return ++count >= 3 ? Observable.throw(error) : Observable.timer(1000);
        } else {
          return Observable.throw(error);
        }
      });
    });
  }

  put(url: string, body: any, options: RequestOptionsArgs = {}) {
    console.log('PUT request initiated');
    console.log('URL - ', url);
    console.log('Body - ', body);
    console.log('Options - ', options);
    return super.put(url, body, { headers: this.headers })
    .retryWhen(attempts => {
      console.log('retryWhen callback');
      let count = 0;
      return attempts.flatMap(error => {
        if (error.status == 0) {
          console.log('########### Now offline #############', error);
          return Observable.timer(++count * 1000);
        } else if (error.status == 500){
          return ++count >= 3 ? Observable.throw(error) : Observable.timer(1000);
        } else {
          return Observable.throw(error);
        }
      });
    });
  }

  patch(url: string, body: any, options: RequestOptionsArgs = {}) {
    console.log('PATCH request initiated');
    console.log('URL - ', url);
    console.log('Body - ', body);
    console.log('Options - ', options);
    return super.patch(url, body, { headers: this.headers })
    .retryWhen(attempts => {
      console.log('retryWhen callback');
      let count = 0;
      return attempts.flatMap(error => {
        if (error.status == 0) {
          console.log('########### Now offline #############', error);
          return Observable.timer(++count * 1000);
        } else if (error.status == 500){
          return ++count >= 3 ? Observable.throw(error) : Observable.timer(1000);
        } else {
          return Observable.throw(error);
        }
      });
    });
  }

  delete(url: string, options: RequestOptionsArgs = {}) {
    console.log('DELETE request initiated');
    console.log('URL - ', url);
    console.log('Options - ', options);
    return super.delete(url, { headers: this.headers })
    .retryWhen(attempts => {
      console.log('retryWhen callback');
      let count = 0;
      return attempts.flatMap(error => {
        if (error.status == 0) {
          console.log('########### Now offline #############', error);
          return Observable.timer(++count * 1000);
        } else if (error.status == 500){
          return ++count >= 3 ? Observable.throw(error) : Observable.timer(1000);
        } else {
          return Observable.throw(error);
        }
      });
    });
  }

}
