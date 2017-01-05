import { WorkItemDetailComponent } from './../work-item-list/work-item-detail/work-item-detail.component';
import { UsersResolve, AuthUserResolve } from './../users.resolver';
import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkItemBoardComponent } from './work-item-board.component';

const routes: Routes = [
  {
    path: 'work-item-board',
    component: WorkItemBoardComponent,
    resolve: {
      allusers: UsersResolve,
      authuser: AuthUserResolve
    },
    children: [
      {
        path: ''
      },
      {
        path: 'detail/:id',
        component: WorkItemDetailComponent,
        resolve: {
          allusers: UsersResolve,
          authuser: AuthUserResolve
        },
      },
    ]
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BoardRoutingModule {}