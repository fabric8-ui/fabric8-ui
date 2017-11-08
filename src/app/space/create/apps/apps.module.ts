import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppsComponent } from './apps.component';
import { AppCardComponent } from './components/app-card.component';
import { AppsRoutingModule } from './apps-routing.module';

import { AppsService } from './services/apps.service';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    CommonModule,
    AppsRoutingModule
  ],
  declarations: [
    AppsComponent,
    AppCardComponent
  ],
  providers: [
    BsDropdownConfig,
    AppsService
  ]
})
export class AppsModule {
  constructor(http: Http) { }
}
