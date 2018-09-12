/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { PipelinesFullHistoryToolbarComponent } from './full-history-toolbar.pipeline.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PipelinesFullHistoryToolbarComponent', () => {
  let component: PipelinesFullHistoryToolbarComponent;
  let fixture: ComponentFixture<PipelinesFullHistoryToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Fabric8CommonModule
      ],
      declarations: [PipelinesFullHistoryToolbarComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesFullHistoryToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
