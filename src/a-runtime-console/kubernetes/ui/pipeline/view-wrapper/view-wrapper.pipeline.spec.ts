/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PipelineViewWrapperComponent } from './view-wrapper.pipeline.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BuildConfigStore } from '../../../store/buildconfig.store';

import { Observable } from 'rxjs';

describe('PipelineViewWrapperComponent', () => {
  let pipeline: PipelineViewWrapperComponent;
  let fixture: ComponentFixture<PipelineViewWrapperComponent>;

  beforeEach(async(() => {
    let mockBuildConfigStore: any = jasmine.createSpy('BuildConfigService');
    mockBuildConfigStore.resource = Observable.of({});
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        PipelineViewWrapperComponent
      ],
      providers: [
        { provide: BuildConfigStore, useValue: mockBuildConfigStore }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineViewWrapperComponent);
    pipeline = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(pipeline).toBeTruthy(); });
});
