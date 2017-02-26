import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';

import { NotificationConfig } from './notification-config';
import { ToastNotificationComponent } from './toast-notification.component';

export {
  NotificationConfig
}

@NgModule({
  imports: [ CommonModule, DropdownModule ],
  declarations: [ ToastNotificationComponent ],
  exports: [ ToastNotificationComponent ]
})
export class NotificationModule { }
