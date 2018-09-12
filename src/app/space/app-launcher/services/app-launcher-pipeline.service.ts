import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  HelperService,
  Pipeline,
  PipelineService
} from 'ngx-launcher';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'ngx-login-client';

@Injectable()
export class AppLauncherPipelineService implements PipelineService {

  // TODO: remove the hardcodes
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private END_POINT: string = '';
  private API_BASE: string = 'services/jenkins/pipelines';
  private ORIGIN: string = '';

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private auth: AuthenticationService
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
      if (this.auth.getToken() != null) {
        this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
      }
      if (this.ORIGIN) {
        this.headers = this.headers.set('X-App', this.ORIGIN);
      }
    }
  }

  getPipelines(filterByRuntime: string = 'maven'): Observable<Pipeline[]> {
    let runtimeEndPoint: string = this.END_POINT + this.API_BASE;
    return this.http
      .get(runtimeEndPoint, { headers: this.headers })
      .map((pipelines: Pipeline[]) => {
        // needs to filter out associated pipelines from list of pipelines
        return pipelines.filter(({platform}) => {
          return platform === (filterByRuntime || platform);
        });
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    if (error instanceof HttpResponse) {
      const body = error.body || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
