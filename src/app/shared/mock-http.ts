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
    private WorkItemSearchRegexp = /work-item-list\/\?name=(.*)/g;

    private mockDataService: MockDataService;

    constructor(private logger: Logger) {
      super(null, null);
      let injector = ReflectiveInjector.resolveAndCreate([MockDataService]);
      this.mockDataService = injector.get(MockDataService);
    };

    parseURL(url: string): any {
      var a = document.createElement('a');
      a.href = url;
      var query = a.search.substr(1);
      var params = {};
      query.split('&').forEach(function(part) {
        if (part) {
          var item = part.split('=');
          params[item[0]] = decodeURIComponent(item[1]);
        }
      });
      // cut off first path element
      var result = {
        path: a['pathname'].replace(/^\/[^\/]+\//, '/'),
        host: a['host'],
        port: a['port'],
        params: params
      };
      // parse extra paths based on resource
      if (result.path.indexOf('/workitems/') == 0) {
        result['extraPath'] = result.path.replace(/^\/workitems\//, '');
        result['path'] = '/workitems';
      }
      this.logger.log('Parsed request path: ' + JSON.stringify(result));
      return result;
    }

    createResponse(url: string, status: number, statusText: string, body: any): Observable<Response> {
      // future extension if needed: may also include headers:Headers
      var responseOptions = new ResponseOptions({
        url: url,
        status: status,
        statusText: statusText,
        body: body
      });
      var res = new Response(responseOptions);
      return Observable.of(res);
    }

    createPage(workItems: any[], params: any): any {
      var offset: number = 0;
      var limit: number = 20;
      if (params['page[offset]'])
        offset = parseInt(params['page[offset]']);
      if (params['page[limit]'])
      limit = params['page[limit]'];
      this.logger.log('Creating paged workItems result: offset=' + offset + ' limit=' + limit);
      var pageItems: any = workItems.slice(offset, limit);
      var result = { 
        'data': pageItems, 
        'links': { 
          'first': 'http://mock.service/api/workitems?page[offset]=0&page[limit]=' + limit,
          'last': 'http://mock.service/api/workitems?page[offset]=' + (workItems.length - limit) + '&page[limit]=' + limit, 
          'next': 'http://mock.service/api/workitems?page[offset]=' + (offset + limit) + '&page[limit]=' + limit 
        }, 
        'meta': { 'totalCount': workItems.length } 
        };
      this.logger.log('Page result: ' + JSON.stringify(result));
      return result;
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
      var path = this.parseURL(url);
      if (path.path == null) {
        this.logger.error('GET request failed with request url ' + url);
        return this.createResponse(url.toString(), 500, 'error', {});  
      }
      this.logger.log('GET request at ' + path.path);
      // add new paths here
      switch (path.path) {
        case '/workitemtypes':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemTypes() );
        case '/workitems':
          if (path.extraPath) {
            return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemOrEntity(path.extraPath) );
          } else {
            return this.createResponse(url.toString(), 200, 'ok', this.createPage(this.mockDataService.getWorkItems(), path.params) );
          }
        case '/user':
          return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getUser() } );
        case '/identities':
          return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getAllUsers() } );          
        case '/work-item-list':
          if (path.params['name']) {
            return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.searchWorkItem(path.params['name']) } );
          } else {
            return this.createResponse(url.toString(), 500, 'error: no search term given.', { } );
          }
        case '/workitemlinks':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemLinks() );
        case '/workitemlinktypes':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemLinkTypes() );
        case '/workitemlinkcategories':
          return this.createResponse(url.toString(), 500, 'not supported yet.', { } );
      }
    };
    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('POST request at ' + url);
      var path = this.parseURL(url);
      if (path.path == null) {
        this.logger.error('POST request failed with request url ' + url);
        return this.createResponse(url.toString(), 500, 'error', {});  
      }
      if (path.path === '/workitems') {
        if (typeof body == 'string')
          body = JSON.parse(body);
        return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.createWorkItemOrEntity(path.extraPath, body));
      } else if (path.path === '/workitemlinks') {
        return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.createWorkItemLink(JSON.parse(body).data) });    
      } else 
        return this.createResponse(url.toString(), 500, 'POST to unknown resource: ' + path.path, {});        
    };
    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('PUT request at ' + url);
      var path = this.parseURL(url);
      if (path.path == null) {
        this.logger.error('PUT request failed with request url ' + url);
        return this.createResponse(url.toString(), 500, 'error', {});  
      }
      if (path.path === '/workitems' && path.extraPath) {
        var result = this.mockDataService.updateWorkItem(JSON.parse(body));
        if (result != null)
          return this.createResponse(url.toString(), 200, 'ok', { data: result });
        else
          return this.createResponse(url.toString(), 500, 'WorkItem does not exist: ' + path.extraPath, {});  
      } else if (path.path === '/workitemlinks' && path.extraPath != null) {
        var result = this.mockDataService.updateWorkItemLink(JSON.parse(body));
        if (result != null)
          return this.createResponse(url.toString(), 200, 'ok', result);
        else
          return this.createResponse(url.toString(), 500, 'WorkItemLink does not exist: ' + path.extraPath, {});      
      } else 
        return this.createResponse(url.toString(), 500, 'PUT to unknown resource: ' + path.extraPath, {});      
    };
    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('DELETE request at ' + url);
      var path = this.parseURL(url);
      if (path.path == null) {
        this.logger.error('DELETE request failed with request url ' + url);
        return this.createResponse(url.toString(), 500, 'error', {});  
      }
      if (path.path === '/workitems' && path.extraPath) {
        if (this.mockDataService.deleteWorkItem(path.extraPath))
          return this.createResponse(url.toString(), 200, 'ok', {});
        else
          return this.createResponse(url.toString(), 500, 'WorkItem does not exist: ' + path.extraPath, {});  
      } else if (path.path === '/workitemlinks' && path.extraPath) {
        if (this.mockDataService.deleteWorkItemLink(path.extraPath))
          return this.createResponse(url.toString(), 200, 'ok', {});
        else
          return this.createResponse(url.toString(), 500, 'WorkItemLink does not exist: ' + path.extraPath, {});  
      }
    };
    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
      // Note: this assumes the PATCH request contains the full entity in the body!
      this.logger.log('PATCH request at ' + url);
      var path = this.parseURL(url);
      if (path.path == null) {
        this.logger.error('PATCH request failed with request url ' + url);
        return this.createResponse(url.toString(), 500, 'error', {});  
      }
      if (path.path === '/workitems' && path.extraPath) {
        var result = this.mockDataService.updateWorkItem(JSON.parse(body).data);
        if (result != null)
          return this.createResponse(url.toString(), 200, 'ok', { data: result });
        else
          return this.createResponse(url.toString(), 500, 'WorkItem does not exist: ' + path.extraPath, {});  
      } else if (path.path === '/workitemlinks' && path.extraPath != null) {
        var result = this.mockDataService.updateWorkItemLink(JSON.parse(body));
        if (result != null)
          return this.createResponse(url.toString(), 200, 'ok', result);
        else
          return this.createResponse(url.toString(), 500, 'WorkItemLink does not exist: ' + path.extraPath, {});      
      } else 
        return this.createResponse(url.toString(), 500, 'PATCH to unknown resource: ' + path.extraPath, {});    
    };
    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('HEAD request at ' + url);
      return this.createResponse(url.toString(), 500, 'PATCH method not implemented in mock-http.', {});
    };
    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('OPTIONS request at ' + url);
      return this.createResponse(url.toString(), 500, 'PATCH method not implemented in mock-http.', {});
    };
}