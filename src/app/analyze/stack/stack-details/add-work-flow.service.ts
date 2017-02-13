import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AddWorkFlowService {

  private stackWorkItemUrl = 'http://demo.api.almighty.io/api/workitems';
  private authoBearerToken = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXQjdBa0hYcV9ZQmRyMWtiekVvNEpwaEludE1RbTdJRnNESk9hdDRCY2tRIn0.eyJqdGkiOiJkOGEzNjM2My0zMDYzLTQ2OWMtODI4Yi00NDk3ZGE4MzE2MTUiLCJleHAiOjE0ODY5ODA5NTcsIm5iZiI6MCwiaWF0IjoxNDg2OTc5MTU3LCJpc3MiOiJodHRwOi8vc3NvLmRlbW8uYWxtaWdodHkuaW8vYXV0aC9yZWFsbXMvZGVtbyIsImF1ZCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwic3ViIjoiNjVjYmQ2M2YtOGVlNi00MWZkLTljMTQtOGYyYWQ4YWZkYWU1IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZmFicmljOC1vbmxpbmUtcGxhdGZvcm0iLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIzMDU2NTM3ZC05Y2NmLTQ5YjMtYTc2Yi0yY2U4ZDI2MWExNjYiLCJhY3IiOiIxIiwiY2xpZW50X3Nlc3Npb24iOiJjYjUzMDFlNC0xM2ZjLTQ4YWMtOWUxMC01Yzc3NjU1NGQ3ZWMiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJicm9rZXIiOnsicm9sZXMiOlsicmVhZC10b2tlbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsInZpZXctcHJvZmlsZSJdfX0sIm5hbWUiOiJUZXN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0dXNlciIsImdpdmVuX25hbWUiOiJUZXN0IiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJ0ZXN0dXNlckBkb21haW4uY29tIn0.hs4-TlB2U2_RM9sQAGGWst0aeWoO4aZ128GYK1dpPkW8ASPL0ww8TDGd8HJQfntxPDBrNWqUC6lO66QWy3WyL1rMu73rErGsvjIv7ecQs-lu_DgZIJIrSKtVGsolcRjsIcLDbszY6-Cv1-DhtMZG9lJ0lIGF-xEWAtQHikeeDFY-AsCQ7V1uh9jkx2qvs15yNq3p_k65MS5DbxxlDt7YR4mnmUqFvs-JYePrOehoeu4EBQ_ZRBGsZ2OIoV5Kz-x-fmeZrsR_ay61i3cqTMR5loY9LBVrLUGlD2n6oJTblTgparXFoLLKFJw33UlGXPnT0zKvwtbMe8rF0fV9xTJqvg`;

  constructor(private http: Http) { }

  addWorkFlow(workItemData: any): Observable<any> {

    let headers = new Headers({ 'Content-Type': 'application/json',
                                'Authorization': this.authoBearerToken });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(workItemData);
    return this.http.post(this.stackWorkItemUrl, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
