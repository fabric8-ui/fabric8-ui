import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToastNotificationExampleComponent } from './toast-notification-example.component';

const routes: Routes = [{
    path: 'toastnotification',
    component: ToastNotificationExampleComponent
  },{
    path: 'toastnotificationlist',
    component: ToastNotificationExampleComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NotificationExampleRoutingModule {}
