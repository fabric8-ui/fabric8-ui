import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { CodeComponent }   from './code.component';
import { CodeRoutingModule }   from './code-routing.module';

@NgModule({
  imports:      [ CommonModule, CodeRoutingModule ],
  declarations: [ CodeComponent ],
  exports: [ CodeComponent ]
})
export class CodeModule { }