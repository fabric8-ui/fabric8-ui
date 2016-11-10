import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { CodeComponent }   from './code.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ CodeComponent ],
  exports: [ CodeComponent ]
})
export class CodeModule { }