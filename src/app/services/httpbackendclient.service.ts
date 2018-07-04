import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * This is to bypass all interceptors
 * (mainly for detailPage on firefox to solve the redirection problem)
 *
 * Working of HttpHandler, HttpBackend according to Angular code documentation :
 *
 * HttpHandler Transforms an `HttpRequest` into a stream of `HttpEvent`s, one of which will likely be a
 * `HttpResponse`.
 * `HttpHandler` is injectable. When injected, the handler instance dispatches requests to the
 * first interceptor in the chain, which dispatches to the second, etc, eventually reaching the
 * `HttpBackend`.
 * In an `HttpInterceptor`, the `HttpHandler` parameter is the next interceptor in the chain.
 *
 * HttpBackend is the final `HttpHandler` which will dispatch the request via browser HTTP APIs to a backend
 *
 * When injected, `HttpBackend` dispatches requests directly to the backend, without going
 * through the interceptor chain.
 *
 */

@Injectable()
export class HttpBackendClient extends HttpClient {
  constructor(handler: HttpBackend) {
    // inject the HttpBackend to
    // disptach the request directly to backend
    super(handler);
  }
}
