import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { WorkItemQuickAddComponent } from './work-item/work-item-quick-add/work-item-quick-add.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'board',
    loadChildren: 'app/work-item/work-item-board/planner-board.module#PlannerBoardModule'
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
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
