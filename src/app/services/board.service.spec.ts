import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { BoardService } from './board.service';
import { HttpService } from './http-service';

import { boardsResponse, spaceTemplateResponse } from './board.snapshot';

describe('BoardService :: ', () => {
  beforeEach(() => {
    const mockHttpService = jasmine.createSpyObj('HttpService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpService,
          useValue: mockHttpService
        },
        BoardService
      ]
    });
  });

  it('getBoardApiUrl :: Should pass cannery test', () => {
    const boardService = TestBed.get(BoardService);
    expect(boardService).not.toBeNull();
    expect(boardService).not.toBeUndefined();
  });

  it('getBoardApiUrl :: Should fetch board api URL', done => {
    const boardService = TestBed.get(BoardService);
    boardService.http.get.and.returnValue(
      Observable.of(
        new Response(
          new ResponseOptions({
            body: JSON.stringify(spaceTemplateResponse),
            status: 200
          })
        )
      ).delay(100)
    );
    boardService.getBoardApiUrl('').subscribe(url => {
      expect(url).toEqual(
        spaceTemplateResponse.data.relationships.workitemboards.links.related
      );
      done();
    });
  });

  it('getBoards :: Should fetch list of boards', done => {
    const boardService = TestBed.get(BoardService);
    boardService.http.get.and.returnValue(
      Observable.of(
        new Response(
          new ResponseOptions({
            body: JSON.stringify(boardsResponse),
            status: 200
          })
        )
      ).delay(100)
    );
    boardService.getBoards('').subscribe(resp => {
      expect(resp).toEqual(boardsResponse);
      done();
    });
  });
});
