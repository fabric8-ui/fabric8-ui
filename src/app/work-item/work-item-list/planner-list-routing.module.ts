import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersResolve, AuthUserResolve } from '../common.resolver';
import { WorkItemDetailComponent } from '../work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item-list.component';

const routes: Routes = [
  {
    path: '',
    component: WorkItemListComponent,
    resolve: {
      allusers: UsersResolve,
      authuser: AuthUserResolve
    },
    children: [
      { path: 'detail/:id',
        component: WorkItemDetailComponent,
        resolve: {
          allusers: UsersResolve,
          authuser: AuthUserResolve
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerListRoutingModule { }
