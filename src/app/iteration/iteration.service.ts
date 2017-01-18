import { Http, Headers } from '@angular/http';
import { AuthenticationService } from './../auth/authentication.service';
import { IterationModel } from './../models/iteration.model';
import { Injectable } from '@angular/core';

@Injectable()
export class IterationService {
  private iterations: IterationModel[] = [];
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private auth: AuthenticationService) {
      if (this.auth.getToken() != null) {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
      }
  }

  /**
   * getIteration - We call this service method to fetch
   * @param iterationUrl - The url to get all the iteration
   * @return Promise of IterationModel[] - Array of iterations
   */
  getIterations(iterationUrl: string = ''): Promise<IterationModel[]> {
    if (this.checkValidIterationUrl(iterationUrl)) {
      return this.http
        .get(iterationUrl, { headers: this.headers })
        .toPromise()
        .then (response => response.json().data as IterationModel[])
        .catch ((error: any) => {
          console.log('Fetch iteration API returned some error - ', error);
          return Promise.reject<IterationModel[]>([] as IterationModel[]);
        })
        .then((data) => {
          this.iterations = data;
          return data;
        })
    } else {
      console.log('URL not matched');
      return Promise.reject<IterationModel[]>([] as IterationModel[]);
    }
  }

  /**
   * Get locally saved iterations' reference
   */
  getIterationList() {
    return this.iterations;
  }

  /**
   * checkValidIterationUrl checks if the API url for
   * iterations is valid or not
   * sample url -
   * http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations
   *
   * @param URL
   * @return Boolean
   */
  checkValidIterationUrl(url: string): Boolean {
    let urlArr: string[] = url.split('/');
    let uuidRegExpPattern = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
    return (
      urlArr[urlArr.length - 1] === 'iterations' &&
      uuidRegExpPattern.test(urlArr[urlArr.length - 2]) &&
      urlArr[urlArr.length - 3] === 'spaces'
    );
  }
}
