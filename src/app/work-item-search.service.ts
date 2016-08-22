import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { WorkItem }           from './work-item';

@Injectable()
export class WorkItemSearchService {
    constructor(private http: Http) {}
    search(term: string) {
        return this.http
            .get(`app/work-item-list/?name=${term}`)
            .map((r: Response) => r.json().data as WorkItem[]);
    }
}
