import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';
import { Request, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseOptions, ResponseOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Logger } from 'ngx-login-client';
import { MockDataService } from './mock-data.service';

/*
 * This class provides a mock of the Angular 2 stock http service. It replaces
 * the stock http service when the mock is used. Currently, the service is
 * replaced 'manually'. When the Angular 2 API on the injectors are more stable,
 * this class should be submitted to the Angular injector service to replace
 * the http service on injection. Currently, this API is unstable and changes
 * frequently, so we did not use it.
 *
 * How to extend the mock: when extending the mock service, you need to modify
 * this class and add new behaviour to the http method functions below. Then you
 * may need to extend the MockDataService to handle new entities and their storage.
 * Actual mock data is placed in the mock generator classes to keep mock data
 * seperated from logic. Note that the generators should only deal with initial data
 * generation, not with persistence or logic.
 */
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

    /*
     * Parses the REST URL, returns a structure describing the base path, params
     * and extra path values.
     */
    parseURL(url: string): any {
      // TODO: when the url patterns get more complex, we should consider re-using
      // some sort of REST URL parsing library to get a proper routing concept.
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
      if (result.path.indexOf('/workitemlinks/') == 0) {
        result['extraPath'] = result.path.replace(/^\/workitemlinks\//, '');
        result['path'] = '/workitemlinks';
      }
      // if request hat a /space prefix, note the space id, the re-parse the extra path
      if (result.path.indexOf('/spaces/') == 0) {
        console.log('Space prefix detected, reparsing url..');
        var spaceId = result.path.split('/')[2];
        var newUrlBase = 'http://mock.service/api/' + result.path.replace(/^\/spaces\/[^\/]+\//, '');
        console.log('Reparsing with url ' + newUrlBase);
        // Recurse to parse sub-path
        var newResult = this.parseURL(newUrlBase);
        newResult.params['spaceId'] = spaceId;
        result = newResult;
      }
      if (result.path.indexOf('/iterations/') == 0) {
        result['extraPath'] = result.path.replace(/^\/iterations\//, '');
        result['path'] = '/iterations';
      }
      this.logger.log('Parsed request path: ' + JSON.stringify(result));
      return result;
    }

    /*
     * Creates and returns a http response structure wrapped in an Observable
     * compatible with the stock http service return values. All results of the
     * service must be wrapped in this envelope to be compatible with the
     * stock http service API.
     */
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

    /*
     * Creates (slices) the requested paging set of a request. Takes the
     * page parameters (offset, size) from the params and slices the
     * work item set accordingly.
     */
    createPage(workItems: any[], params: any): any {
      this.logger.log('Workitems in filter = ' + workItems);

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

    /*
     * Performs a request with 'get' http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
      var path = this.parseURL(url);

      if (path.params['filter[assignee]'])
        this.logger.log('The assignee is: ' + path.params['filter[assignee]']);

      if (path.path == null) {
        this.logger.error('GET request failed with request url ' + url);
        return this.createResponse(url.toString(), 500, 'error', {});
      }
      this.logger.log('GET request at ' + path.path + ' url= ' + url.toString() + ' params=' + path.params.toString());
      if (path.extraPath) {
        this.logger.log ('GET request with extraPath at ' + path.extraPath + ' url= '+ url.toString() + ' params=' + path.params.toString());
      }
      // add new paths here
      switch (path.path) {
        case '/workitemtypes':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemTypes() );
        case '/workitems':
          if (path.extraPath) {
            return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemOrEntity(path.extraPath) );
          }
          else if (path.params['filter[assignee]']) {
                return this.createResponse(url.toString(), 200, 'ok', this.createPage(this.mockDataService.getWorkItemsFiltered(path.params['filter[assignee]']), path.params) );
          } else {
            return this.createResponse(url.toString(), 200, 'ok', this.createPage(this.mockDataService.getWorkItems(), path.params) );
          }
        case '/user':
          return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getUser() } );
        case '/users':
          return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getAllUsers() } );
        case '/work-item-list':
          if (path.params['name']) {
            return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.searchWorkItem(path.params['name']) } );
          } else {
            return this.createResponse(url.toString(), 500, 'error: no search term given.', { } );
          }
        case '/workitemlinks':
          var workItemLinks = this.mockDataService.getWorkItemLinks();
          return this.createResponse(url.toString(), 200, 'ok', { data: workItemLinks, 'meta': { 'totalCount': workItemLinks.length} } );
        case '/workitemlinktypes':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemLinkTypes() );
        case '/workitemlinkcategories':
          return this.createResponse(url.toString(), 500, 'not supported yet.', { } );
        case '/spaces':
          return this.createResponse(url.toString(), 500, 'not supported yet.', { } );
        case '/search':
          return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getWorkItems() });
        case '/iterations':
          var iterations = this.mockDataService.getAllIterations();
          return this.createResponse(url.toString(), 200, 'ok', { data: iterations, 'meta': { 'totalCount': iterations.length} } );
        case '/source-link-types':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemLinkTypes() );
        case '/target-link-types':
          return this.createResponse(url.toString(), 200, 'ok', this.mockDataService.getWorkItemLinkTypes() );
      }
    };

    /*
     * Performs a request with 'post' http method.
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
      } else if (path.path === '/iterations') {
        if (typeof body == 'string')
          body = JSON.parse(body);
        return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.createIteration(body) });
      } else if (path.path === '/workitemlinks') {
        return this.createResponse(url.toString(), 200, 'ok', {
          data: this.mockDataService.createWorkItemLink(JSON.parse(body).data),
          included: this.mockDataService.createWorkItemLinkIncludes(JSON.parse(body).data)
        });
      } else if (path.path === '/render') {
        return this.createResponse(url.toString(), 200, 'ok', { data: this.mockDataService.getRedneredText(JSON.parse(body).data) });
      } else {
        return this.createResponse(url.toString(), 500, 'POST to unknown resource: ' + path.path, {});
      }
    };

    /*
     * Performs a request with 'put' http method.
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

    /*
     * Performs a request with 'delete' http method.
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
      } else if (path.path === '/iterations' && path.extraPath) {
        if (this.mockDataService.deleteIteration(path.extraPath))
          return this.createResponse(url.toString(), 200, 'ok', {});
        else
          return this.createResponse(url.toString(), 500, 'Iteration does not exist: ' + path.extraPath, {});
      } else if (path.path === '/workitemlinks' && path.extraPath) {
        if (this.mockDataService.deleteWorkItemLink(path.extraPath))
          return this.createResponse(url.toString(), 200, 'ok', {});
        else
          return this.createResponse(url.toString(), 500, 'WorkItemLink does not exist: ' + path.extraPath, {});
      }
    };

    /*
     * Performs a request with 'patch' http method.
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
      } else if (path.path === '/iterations' && path.extraPath != null) {
        var result = this.mockDataService.updateIteration(body);
        if (result != null)
          return this.createResponse(url.toString(), 200, 'ok', { data: result });
        else
          return this.createResponse(url.toString(), 500, 'Iteration does not exist: ' + path.extraPath, {});
      } else
        return this.createResponse(url.toString(), 500, 'PATCH to unknown resource: ' + path.extraPath, {});
    };

    /*
     * Performs a request with 'head' http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('HEAD request at ' + url);
      return this.createResponse(url.toString(), 500, 'PATCH method not implemented in mock-http.', {});
    };

    /*
     * Performs a request with 'options' http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.logger.log('OPTIONS request at ' + url);
      return this.createResponse(url.toString(), 500, 'PATCH method not implemented in mock-http.', {});
    };
}
