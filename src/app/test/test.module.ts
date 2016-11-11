import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { TestComponent }   from './test.component';
import { TestRoutingModule } from './test-routing.module';

@NgModule({
  imports:      [ CommonModule, TestRoutingModule ],
  declarations: [ TestComponent ],
  exports: [ TestComponent ]
})
export class TestModule { }