import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { CustomQueryModel } from '../models/custom-query.model';
import { CustomQueryService } from './custom-query.service';
import { HttpService } from './http-service';

describe('Custom Query :: Unit Tests', () => {
  let customqueryService: CustomQueryService;
  let httpService: jasmine.SpyObj<HttpService>;
  let spy, resp;
  beforeEach(() => {
    spy = jasmine.createSpyObj('HttpService', ['get', 'post', 'delete']);
    TestBed.configureTestingModule(
      {
        providers: [
          CustomQueryService,
          { provide: HttpService, useValue: spy}
        ]
      }
    );
    customqueryService = TestBed.get(CustomQueryService);
    httpService = TestBed.get(HttpService);
  });

  it('should get all the custom queries', () => {
    httpService.get.and.returnValue(Observable.of(new Response(
      new ResponseOptions({
        body: JSON.stringify({
          data: [] as CustomQueryModel[]
        }),
        status: 200
      })
    )));

    customqueryService.getCustomQueries('')
      .subscribe((d) => {
        expect(d).toEqual([] as CustomQueryModel[]);
      });
  });

  it('should create a custom query', () => {
    httpService.post.and.returnValue(Observable.of(new Response(
      new ResponseOptions({
        body: JSON.stringify({
          data: {} as CustomQueryModel
        }),
        status: 200
      }))));
    customqueryService.create({} as CustomQueryModel, '')
      .subscribe(d => {
        expect(d).toEqual({} as CustomQueryModel);
      });
  });

  it('should delete a custom query', () => {
    httpService.delete.and.returnValue(Observable.of(new Response(
      new ResponseOptions({
        status: 200
    }))));
    customqueryService.delete('').subscribe(() => {
      expect(httpService.delete).toHaveBeenCalled();
    });
  });

});
