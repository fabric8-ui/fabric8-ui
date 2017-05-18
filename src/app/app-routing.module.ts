import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { WorkItemQuickAddComponent } from './components/work-item-quick-add/work-item-quick-add.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'plan/list',
    pathMatch: 'full'
  },
  {
    path: 'plan/list',
    loadChildren: 'app/components/planner-list/planner-list.module#PlannerListModule'
  },
  {
    path: 'plan/board',
    loadChildren: 'app/components/planner-board/planner-board.module#PlannerBoardModule'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'quick-add/:id',
    component: WorkItemQuickAddComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: false }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
