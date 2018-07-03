import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpClientService {

  constructor(
    private http: HttpClient
  ) {}

  private setHeaders(options) {
    let headers = new HttpHeaders();
    // This is a hack to forcefully define no extra header
    // to the request
    if (Object.keys(options).length && Object.keys(options)[0] === 'no-header') {
      return headers;
    }
    (<any> Object).entries(options).forEach(([key, value]) => {
      headers.set(key, value);
    });
    return headers;
  }

  get<T>(url: string, options = {}) {
    console.log('GET request initiated');
    console.log('URL - ', url);
    console.log('Options - ', options);
    return this.http.get<any | T>(url, { headers: this.setHeaders(options) })
    .retryWhen(attempts => {
      console.log('retryWhen callback');
      let count = 0;
      return attempts.flatMap(error => {
        if (error.status == 0) { // Server offline :: keep trying
          console.log('########### Now offline #############', error);
          return Observable.timer(++count * 1000);
        } else if (error.status == 500 || error.status == 401) { // Server error :: Try 3 times then throw error
          return ++count >= 3 ? Observable.throw(error) : Observable.timer(1000);
        } else {
          return Observable.throw(error);
        }
      });
    });
  }
}
