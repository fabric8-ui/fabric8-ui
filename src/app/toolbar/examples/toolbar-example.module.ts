import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersModule } from '../../filters/filters.module';
import { HttpModule, Http } from '@angular/http';

import {
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig
} from 'ng2-bootstrap';

import { ToolbarModule } from '../toolbar.module';
import { ToolbarExampleComponent } from './toolbar-example.component';
import { ToolbarExampleRoutingModule } from './toolbar-example-routing.module';

@NgModule({
  declarations: [ ToolbarExampleComponent ],
  imports: [
    CommonModule,
    DropdownModule,
    HttpModule,
    FiltersModule,
    ToolbarExampleRoutingModule,
    ToolbarModule
  ],
  providers: [ComponentLoaderFactory, DropdownConfig, PositioningService, TooltipConfig]
})
export class ToolbarExampleModule {
  constructor(http: Http) {}
}
