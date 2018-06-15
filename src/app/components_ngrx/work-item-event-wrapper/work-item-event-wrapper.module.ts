import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { CollapseModule } from 'ngx-bootstrap';
import { AuthenticationService } from 'ngx-login-client';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { EventQuery } from '../../models/event.model';
import { GlobalSettings } from '../../shared/globals';
import { WorkItemEventModule } from '../work-item-event/work-item-event.module';
import { HttpService } from './../../services/http-service';
import { WorkItemEventWrapperComponent } from './work-item-event-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    CollapseModule,
    EmptyStateModule,
    WorkItemEventModule],
  declarations: [WorkItemEventWrapperComponent],
  exports: [WorkItemEventWrapperComponent],
  providers: [EventQuery]
})

export class WorkItemEventWrapperModule { }
