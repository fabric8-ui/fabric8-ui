import { CommonModule } from '@angular/common';
import { NgModule }     from '@angular/core';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';

import { MockHttp } from './../../mock/mock-http';

import { WorkItemNewDetailComponent } from './work-item-new-detail.component';
import { WorkItemNewDetailRoutingModule } from './work-item-new-detail-routing.module';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [ { provide: Http, useExisting: MockHttp } ];
} else {
  providers = [];
}

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    WorkItemNewDetailRoutingModule
  ],
  declarations: [
    WorkItemNewDetailComponent
  ],
  exports: [WorkItemNewDetailComponent],
  providers: providers
})
export class WorkItemNewDetailModule { }
