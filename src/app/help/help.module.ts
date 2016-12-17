import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { HelpComponent }     from './help.component';
import { HelpRoutingModule } from './help-routing.module';

@NgModule({
  imports:      [ CommonModule, HelpRoutingModule, HttpModule ],
  declarations: [ HelpComponent ],
})
export class HelpModule {
  constructor(http: Http) {}
}