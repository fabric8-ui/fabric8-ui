import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesComponent } from './resources.component';
import { ContextCurrentUserAuthGuard } from './../../shared/context-current-user-auth-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [ContextCurrentUserAuthGuard],
    component: ResourcesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ResourcesRoutingModule {}
