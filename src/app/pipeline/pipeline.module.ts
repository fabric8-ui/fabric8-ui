import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { PipelineComponent }   from './pipeline.component';
import { PipelineRoutingModule }   from './pipeline-routing.module';

@NgModule({
  imports:      [ CommonModule, PipelineRoutingModule ],
  declarations: [ PipelineComponent ],
  exports: [ PipelineComponent ]
})
export class PipelineModule { }