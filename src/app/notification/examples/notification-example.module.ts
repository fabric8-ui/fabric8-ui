import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { NotificationModule } from '../notification.module';
import { NotificationExampleRoutingModule } from './notification-example-routing.module';
import { NotificationService } from '../notification.service';
import { NotificationExampleService } from './notification-example.service';
import { ToastNotificationExampleComponent } from './toast-notification-example.component';
import { ToastNotificationListExampleComponent } from './toast-notification-list-example.component';

@NgModule({
  declarations: [ ToastNotificationExampleComponent, ToastNotificationListExampleComponent ],
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    HttpModule,
    NotificationModule,
    NotificationExampleRoutingModule
  ],
  providers: [ {
    provide: NotificationService,
    useClass: NotificationExampleService
  }]
})
export class NotificationExampleModule {
  constructor(http: Http) {}
}
