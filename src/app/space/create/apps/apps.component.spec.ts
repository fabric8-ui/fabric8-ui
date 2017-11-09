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

    spyOn(mockSvc, 'getApplications').and.callThrough();
    spyOn(mockSvc, 'getEnvironments').and.callThrough();
    spyOn(mockSvc, 'getPodCount').and.callThrough();
    spyOn(mockSvc, 'getCpuStat').and.callThrough();
    spyOn(mockSvc, 'getMemoryStat').and.callThrough();

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [ AppsComponent, FakeAppCardComponent ],
      providers: [{ provide: AppsService, useValue: mockSvc }]
    });

    fixture = TestBed.createComponent(AppsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set service result to applications property', () => {
    expect(mockSvc.getApplications).toHaveBeenCalled();
    expect(component.applications).toEqual(['foo-app', 'bar-app']);
  });

  it('should set service result to environments property', () => {
    expect(mockSvc.getEnvironments).toHaveBeenCalled();
    expect(component.environments).toEqual([
      { environmentId: 'a1', name: 'stage' },
      { environmentId: 'b2', name: 'prod' }
    ]);
  });

});
