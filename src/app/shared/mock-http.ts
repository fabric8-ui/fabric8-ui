import Globals = require('./globals');

import { ReflectiveInjector } from '@angular/core';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Request, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseOptions, ResponseOptionsArgs } from '@angular/http';

import { Logger } from './../shared/logger.service';
import { MockDataService } from './mock-data.service';

@Injectable()
export class MockHttp extends Http {

    private UrlRegex = /app(\/.*)/g;
    private WorkItemRegex = /workitems\/(.*)/g;
    private mockDataService: MockDataService;

    constructor(private logger: Logger) {
      super(null, null);
      let injector = ReflectiveInjector.resolveAndCreate([MockDataService]);
      this.mockDataService = injector.get(MockDataService);
    };

    getPathFromUrl(url: string): any {
      var resultArr: string[] = new RegExp(this.UrlRegex).exec(url);
      if (!resultArr || resultArr.length === 0) {
        this.logger.error('URL pattern is not supported by mock http service: ' + url);
        return null;
      } else {
        if (resultArr[1].startsWith('/workitems') && resultArr[1] != '/workitems' && resultArr[1] != '/workitems.2') {
          var pathArr: string[] = new RegExp(this.WorkItemRegex).exec(resultArr[1]);
          if (!pathArr || pathArr.length === 0) {
            this.logger.error('URL pattern is a work item reference but without id reference: ' + url);
            return null;
          } else {
            return { path: '/workitems', refid: pathArr[1]}
          }
        }
        return { path: resultArr[1], refid: null };
      }
    }

    createResponse(url: string, status: number, statusText: string, body: any): Observable<Response> {
      // future extension if needed: may also include headers:Headers
      var responseOptions = new ResponseOptions({
        url: url,
        status: status,
        statusText: statusText,
        body: JSON.stringify(body)
      });
      var res = new Response(responseOptions);
      return Observable.of(res);
    }

    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
      if (typeof url === 'string') 
        return this.get(url, options);
      else
        this.logger.error('HTTP Requests with Request object arguments are not supported yet.');
      return null;
    };
    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
      var path = this.getPathFromUrl(url);
      if (path == null) {
        this.logger.error('GET request failed with request url ' + url);
        return this.createResponse(url.toString(), 500, 'Error', {});  
      }
      this.logger.log('GET request at ' + path.path);
      // add new paths here
      switch (path.path) {
        case '/workitems.2':
          return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getWorkItems() } );
        case '/workitemtypes':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemTypes() );
        case '/workitems':
          if (path.refid) {
            if (path.refid=='somethingillegal')
              return this.createResponse(url.toString(), 501, 'error', {} );
            else   
              return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItem(path.refid) );
          } else {
            return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getWorkItemTypes() } );
          }
      }
    };
    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('POST request at ' + url);
      console.log("HERE I AM.");
      return null;
    };
    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('PUT request at ' + url);
      console.log("HERE I AM.");
      return null;
    };
    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('DELETE request at ' + url);

      console.log("HERE I AM.");
      return null;
    };
    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('PATCH request at ' + url);

      console.log("HERE I AM.");
      return null;
    };
    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('HEAD request at ' + url);

      console.log("HERE I AM.");
      return null;
    };
    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('OPTIONS request at ' + url);

      console.log("HERE I AM.");
      return null;
    };
}