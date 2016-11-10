import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { HypothesisComponent }   from './hypothesis.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ HypothesisComponent ],
  exports: [ HypothesisComponent ]
})
export class HypothesisModule { }