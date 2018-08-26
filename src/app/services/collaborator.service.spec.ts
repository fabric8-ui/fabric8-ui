import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { User } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from '../shared/http-module/http.service';
import { CollaboratorService } from './collaborator.service';


describe('Unit test :: Collaborator Service', () => {
  let spy;
  beforeEach(() => {
    spy = jasmine.createSpyObj('HttpClientService', ['get']);
    TestBed.configureTestingModule(
      {
        providers: [
          CollaboratorService,
          {provide: HttpClientService, useValue: spy}
        ]
      }
    );
  });

  it('should call get from HTTP service', async () => {
    const collabService = TestBed.get(CollaboratorService);
    const returnValue = {
      data: [] as User[]
    };

    collabService.httpClienService.get.and.returnValue(
      Observable.of(new Response(
        new ResponseOptions({
          body: JSON.stringify(returnValue),
          status: 200
        })
      ))
    );
    collabService.getCollaborators('').subscribe((d) => {
      console.log('########', d, returnValue.data);
      expect(d).toEqual(returnValue.data);
    });
  });
});
