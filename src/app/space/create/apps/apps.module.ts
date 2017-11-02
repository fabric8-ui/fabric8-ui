import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { AppsComponent } from './apps.component';
import { AppsRoutingModule } from './apps-routing.module';

import { AppsService } from './services/apps.service';

@NgModule({
  imports: [
    CommonModule,
    AppsRoutingModule
  ],
  declarations: [AppsComponent],
  providers: [AppsService]
})
export class AppsModule {
  constructor(http: Http) { }
}
