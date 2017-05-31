import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PlannerListModule } from 'fabric8-planner';
import { PlannerBoardModule } from 'fabric8-planner';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'plan/list',
    pathMatch: 'full'
  },
  {
    path: 'plan/list',
    loadChildren: './components/plan-list.module#PlanListModule'
  },
  {
    path: 'plan/board',
    loadChildren: './components/plan-board.module#PlanBoardModule'
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: false }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
