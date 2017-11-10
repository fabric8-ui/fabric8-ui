import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  Input
} from '@angular/core';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppsComponent } from './apps.component';
import {
  AppsService,
  Environment
} from './services/apps.service';

import { Contexts } from 'ngx-fabric8-wit';

@Component({
  selector: 'app-card',
  template: ''
})
class FakeAppCardComponent {
  @Input() applicationId: string;
  @Input() environment: Environment;
}

describe('AppsComponent', () => {

  let component: AppsComponent;
  let fixture: ComponentFixture<AppsComponent>;
  let mockSvc: AppsService;
  let contexts: Contexts;

  beforeEach(() => {
    mockSvc = {
      getApplications: () => Observable.of(['foo-app', 'bar-app']),
      getEnvironments: () => Observable.of([
        { environmentId: 'a1', name: 'stage' },
        { environmentId: 'b2', name: 'prod' }
      ]),
      getPodCount: () => { throw 'Not Implemented'; },
      getCpuStat: () => { throw 'Not Implemented'; },
      getMemoryStat: () => { throw 'Not Implemented'; }
    };

    contexts = {
      current: Observable.of({
        user: null,
        space: { id: 'fake-spaceId' },
        type: null,
        path: '',
        name: 'fake-ctx'
      })
    } as Contexts;

    spyOn(mockSvc, 'getApplications').and.callThrough();
    spyOn(mockSvc, 'getEnvironments').and.callThrough();
    spyOn(mockSvc, 'getPodCount').and.callThrough();
    spyOn(mockSvc, 'getCpuStat').and.callThrough();
    spyOn(mockSvc, 'getMemoryStat').and.callThrough();

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [ AppsComponent, FakeAppCardComponent ],
      providers: [
        { provide: AppsService, useValue: mockSvc },
        { provide: Contexts, useValue: contexts }
      ]
    });

    fixture = TestBed.createComponent(AppsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set service result to applications property', (done: DoneFn) => {
    expect(mockSvc.getApplications).toHaveBeenCalledWith('fake-spaceId');
    component.applications.subscribe(applications => {
      expect(applications).toEqual(['foo-app', 'bar-app']);
      done();
    });
  });

  it('should set service result to environments property', (done: DoneFn) => {
    expect(mockSvc.getEnvironments).toHaveBeenCalledWith('fake-spaceId');
    component.environments.subscribe(environments => {
      expect(environments).toEqual([
        { environmentId: 'a1', name: 'stage' },
        { environmentId: 'b2', name: 'prod' }
      ]);
      done();
    });
  });

});
