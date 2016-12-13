import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notifications',
    pathMatch: 'full'
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NotificationsRoutingModule {}