import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { LearnComponent }   from './learn.component';
import { LearnRoutingModule }   from './learn-routing.module';

@NgModule({
  imports:      [ CommonModule, LearnRoutingModule ],
  declarations: [ LearnComponent ],
  exports: [ LearnComponent ]
})
export class LearnModule { }