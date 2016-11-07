import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkItemDetailComponent } from './work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item-list.component';

const routes: Routes = [
  {
    path: 'work-item-list',
    component: WorkItemListComponent,
    children: [
      {
        path: ''
      },
      {
        path: 'detail/:id',
        component: WorkItemDetailComponent
      },
    ]
  },
  
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkItemListRoutingModule {}