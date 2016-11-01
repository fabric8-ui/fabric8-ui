import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkItemListComponent } from './work-item-list/work-item-list.component';
import { WorkItemDetailComponent } from './work-item-detail/work-item-detail.component';

const routes: Routes = [
  {
    path: 'work-item-list',
    component: WorkItemListComponent
  },
  {
    path: 'detail/:id',
    component: WorkItemDetailComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkItemRoutingModule {}