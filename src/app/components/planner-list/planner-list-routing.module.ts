import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkItemDetailComponent } from '../work-item-detail/work-item-detail.component';
import { PlannerListComponent } from './planner-list.component';

const routes: Routes = [
  {
    path: '',
    component: PlannerListComponent,
    children: [
      { path: 'detail/:id',
        component: WorkItemDetailComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerListRoutingModule { }
