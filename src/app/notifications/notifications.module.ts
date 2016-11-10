import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { NotificationsComponent }   from './notifications.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ NotificationsComponent ],
  exports: [ NotificationsComponent ]
})
export class NotificationsModule { }