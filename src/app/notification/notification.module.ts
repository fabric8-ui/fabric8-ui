import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';

import { NotificationEvent } from './notification-event';
import { ToastNotificationComponent } from './toast-notification.component';
import { ToastNotificationListComponent } from './toast-notification-list.component';

export {
  NotificationEvent
}

@NgModule({
  imports: [ CommonModule, DropdownModule ],
  declarations: [ ToastNotificationComponent, ToastNotificationListComponent ],
  exports: [ ToastNotificationComponent, ToastNotificationListComponent ]
})
export class NotificationModule { }
