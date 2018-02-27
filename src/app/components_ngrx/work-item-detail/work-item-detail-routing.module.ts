import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { WorkItemDetailComponent } from './work-item-detail.component';

const routes: Routes = [
  {
    path: ':id',
    component: WorkItemDetailComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WorkItemDetailRoutingModule { }
