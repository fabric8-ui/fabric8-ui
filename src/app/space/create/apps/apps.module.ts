import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppsComponent } from './apps.component';
import { AppsRoutingModule } from './apps-routing.module';

import { AppsService } from './services/apps.service';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CommonModule,
    AppsRoutingModule
  ],
  declarations: [AppsComponent],
  providers: [
    BsDropdownConfig,
    AppsService
  ]
})
export class AppsModule {
  constructor(http: Http) { }
}
