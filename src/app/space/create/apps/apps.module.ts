import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { AppsComponent } from './apps.component';
import { AppsRoutingModule } from './apps-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AppsRoutingModule
  ],
  declarations: [AppsComponent]
})
export class AppsModule {
  constructor(http: Http) { }
}
