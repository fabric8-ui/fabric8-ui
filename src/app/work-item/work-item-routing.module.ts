import { WorkItemBoardComponent } from './work-item-board/work-item-board.component';
import { WorkItemDetailComponent } from './work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item-list/work-item-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsersResolve, AuthUserResolve, IterationsResolve } from './common.resolver';
import { WorkItemComponent } from './work-item.component';

const routes: Routes = [
  {
    path: 'work-item',
    component: WorkItemComponent,
    resolve: {
      allIterations: IterationsResolve,
      allusers: UsersResolve,
      authuser: AuthUserResolve

    },
    children: [
      {
        path: 'list',
        component: WorkItemListComponent,
        resolve: {
          allIterations: IterationsResolve,
          allusers: UsersResolve,
          authuser: AuthUserResolve
        },
        children: [
          {
            path: 'detail/:id',
            component: WorkItemDetailComponent,
            resolve: {
              allIterations: IterationsResolve,
              allusers: UsersResolve,
              authuser: AuthUserResolve
            }
          }
        ]
      },

      {
        path: 'board',
        component: WorkItemBoardComponent,
        resolve: {
          allIterations: IterationsResolve,
          allusers: UsersResolve,
          authuser: AuthUserResolve
        },
        children: [
          {
            path: 'detail/:id',
            component: WorkItemDetailComponent,
            resolve: {
              allIterations: IterationsResolve,
              allusers: UsersResolve,
              authuser: AuthUserResolve
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkItemRoutingModule {}
