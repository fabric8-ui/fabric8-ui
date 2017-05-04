import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { RemainingCharsComponent } from './remainingchars.component';
import { RemainingCharsConfig } from './remainingchars-config';

describe('Remaining chars component - ', () => {
  let comp: RemainingCharsComponent;
  let fixture: ComponentFixture<RemainingCharsComponent>;
  let config: RemainingCharsConfig;

  beforeEach(() => {
    config = {
    } as RemainingCharsConfig;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RemainingCharsComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RemainingCharsComponent);
        comp = fixture.componentInstance;
        comp.config = config;
        fixture.detectChanges();
      });
  }));

});
