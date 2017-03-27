import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { LandingPageComponent }   from './landing-page.component';
import { LandingPageRoutingModule }   from './landing-page-routing.module';

@NgModule({
  imports:      [ CommonModule, LandingPageRoutingModule, HttpModule ],
  declarations: [ LandingPageComponent ]
})
export class LandingPageModule {
  constructor(http: Http) {}
}
