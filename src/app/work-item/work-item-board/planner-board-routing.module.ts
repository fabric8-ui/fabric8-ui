import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkItemDetailComponent } from '../work-item-detail/work-item-detail.component';
import { WorkItemBoardComponent } from './work-item-board.component';

const routes: Routes = [
  {
    path: '',
    component: WorkItemBoardComponent,
    children: [
      {
        path: 'detail/:id',
        component: WorkItemDetailComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerBoardRoutingModule { }
