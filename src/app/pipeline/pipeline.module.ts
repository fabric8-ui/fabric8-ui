import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { PipelineComponent }   from './pipeline.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ PipelineComponent ],
  exports: [ PipelineComponent ]
})
export class PipelineModule { }