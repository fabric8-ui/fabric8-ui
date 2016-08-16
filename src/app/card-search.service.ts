import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Card }           from './card';

@Injectable()
export class CardSearchService {
    constructor(private http: Http) {}
    search(term: string) {
        return this.http
            .get(`app/card-list/?name=${term}`)
            .map((r: Response) => r.json().data as Card[]);
    }
}
