import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AboutComponent }   from './about.component';
import { AboutRoutingModule }   from './about-routing.module';

@NgModule({
  imports:      [ CommonModule, AboutRoutingModule, HttpModule ],
  declarations: [ AboutComponent ]
})
export class AboutModule {
  constructor(http: Http) {}
}
