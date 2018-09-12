/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PipelinesFullHistoryPage } from './full-history-page.pipeline.component';

import { APIsStore } from '../../../store/apis.store';
import { BuildStore } from '../../../store/build.store';
import { BuildConfigStore } from '../../../store/buildconfig.store';

describe('PipelinesFullHistoryPage', () => {
  let component: PipelinesFullHistoryPage;
  let fixture: ComponentFixture<PipelinesFullHistoryPage>;

  beforeEach(async(() => {
    let mockBuildConfigStore: any = jasmine.createSpy('BuildConfigStore');
    mockBuildConfigStore.loading = Observable.of(true);
    mockBuildConfigStore.list = Observable.empty();
    let mockBuildStore: any = jasmine.createSpy('BuildStore');
    mockBuildStore.loading = Observable.of(true);
    mockBuildStore.list = Observable.empty();
    let mockAPIsStore: any = jasmine.createSpyObj('APIsStore', ['load']);
    mockAPIsStore.loading = Observable.empty();

    TestBed.configureTestingModule({
      declarations: [
        PipelinesFullHistoryPage
      ],
      providers: [
        { provide: BuildConfigStore, useValue: mockBuildConfigStore },
        { provide: BuildStore, useValue: mockBuildStore },
        { provide: APIsStore, useValue: mockAPIsStore }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesFullHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
