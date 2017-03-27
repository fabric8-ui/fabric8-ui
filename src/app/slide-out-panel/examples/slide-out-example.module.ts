import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SlideOutPanelModule } from '../slide-out-panel.module';
import { SlideOutExampleComponent } from './slide-out-example.component';
import { SlideOutExampleRoutingModule } from './slide-out-example-routing.module';

@NgModule({
  imports: [ CommonModule, HttpModule, SlideOutExampleRoutingModule, SlideOutPanelModule ],
  declarations: [ SlideOutExampleComponent ]
})
export class SlideOutExampleModule {
  constructor(http: Http) {}
}
