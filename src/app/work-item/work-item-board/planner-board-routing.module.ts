import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersResolve, AuthUserResolve } from '../common.resolver';
import { WorkItemDetailComponent } from '../work-item-detail/work-item-detail.component';
import { WorkItemBoardComponent } from './work-item-board.component';

const routes: Routes = [
  {
    path: '',
    component: WorkItemBoardComponent,
    resolve: {
      allusers: UsersResolve,
      authuser: AuthUserResolve
    }
    children: [
      { path: 'detail/:id',
        component: WorkItemDetailComponent,
        resolve: {
          allusers: UsersResolve,
          authuser: AuthUserResolve
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerBoardRoutingModule { }
