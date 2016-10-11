import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';

import { WorkItem } from '../work-item';

@Injectable()
export class WorkItemSearchService {
  constructor(private http: Http) {
  }

  search(term: string): Observable<WorkItem[]> {
    return this.http
      .get(`app/work-item-list/?name=${term}`)
      .map((r: Response) => r.json().data as WorkItem[]);
  }
}
