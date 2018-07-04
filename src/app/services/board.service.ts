import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardModel } from './../models/board.model';
import { HttpService } from './http-service';

@Injectable()
export class BoardService {
    constructor(private http: HttpService) {}

    /**
     * Usage: this is used to get the board API url from spacetemplate response
     * @param spaceTemplateApiUrl
     */
    getBoardApiUrl(spaceTemplateApiUrl: string) {
        return this.http.get(spaceTemplateApiUrl)
            .map(resp => resp.json().data)
            .map(template => template.relationships.workitemboards.links.related);
    }

    /**
     * Usage: this is to get the list board for a sapce
     * @param boardUrl
     */
    getBoards(boardUrl: string): Observable<BoardModel[]> {
        return this.http.get(boardUrl)
            .map(resp => resp.json().data);
    }


}
