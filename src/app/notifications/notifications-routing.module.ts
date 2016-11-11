import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  {
    path: 'notifications',
    component: NotificationsComponent,
    children: [
      {
        path: ''
      }
    ]
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NotificationsRoutingModule {}