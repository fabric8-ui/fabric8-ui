import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DropdownModule } from '../dropdown/dropdown.module';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarRoutingModule } from './toolbar-routing.module';

@NgModule({
  imports:      [ CommonModule, DropdownModule, ToolbarRoutingModule, HttpModule ],
  declarations: [ ToolbarComponent ]
})
export class ToolbarModule {
  constructor(http: Http) {}
}
