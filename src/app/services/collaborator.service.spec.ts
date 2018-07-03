import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { User } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import { CollaboratorService } from './collaborator.service';
import { HttpService } from './http-service';


describe('Unit test :: Collaborator Service', () => {
  let collabService: CollaboratorService;
  let httpService: jasmine.SpyObj<HttpService>;
  let spy;
  beforeEach(() => {
    spy = jasmine.createSpyObj('HttpService', ['get']);
    TestBed.configureTestingModule(
      {
        providers: [
          CollaboratorService,
          {provide: HttpService, useValue: spy}
        ]
      }
    );
    collabService = TestBed.get(CollaboratorService);
    httpService = TestBed.get(HttpService);
  });

  it('should call get from HTTP service', async () => {
    const returnValue = {
      data: [] as User[]
    };
    const resp = new Response(
      new ResponseOptions({
        body: JSON.stringify(returnValue),
        status: 200
      })
    );

    httpService.get.and.returnValue(
      Observable.of(resp)
    );
    collabService.getCollaborators('').subscribe((d) => {
      expect(d).toEqual(returnValue.data);
    });
  });
});
