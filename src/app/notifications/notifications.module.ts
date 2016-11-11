import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { NotificationsComponent }   from './notifications.component';
import { NotificationsRoutingModule }   from './notifications-routing.module';

@NgModule({
  imports:      [ CommonModule, NotificationsRoutingModule ],
  declarations: [ NotificationsComponent ],
  exports: [ NotificationsComponent ]
})
export class NotificationsModule { }