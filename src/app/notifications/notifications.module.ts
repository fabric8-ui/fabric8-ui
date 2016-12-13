import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { NotificationsComponent }     from './notifications.component';
import { NotificationsRoutingModule } from './notifications-routing.module';

@NgModule({
  imports:      [ CommonModule, NotificationsRoutingModule, HttpModule ],
  declarations: [ NotificationsComponent ]
})
export class NotificationsModule {
  constructor(http: Http) {}
}