import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';

import { BoardComponent } from './board/board.component';

import { HomeComponent } from './home/home.component';
import { CodeComponent } from './code/code.component';
import { TestComponent } from './test/test.component';
import { PipelineComponent } from './pipeline/pipeline.component';
import { HypothesisComponent } from './hypothesis/hypothesis.component';


// import { WorkItemDetailComponent } from './work-item/work-item-detail/work-item-detail.component';
// import { WorkItemListComponent } from './work-item/work-item-list/work-item-list.component';
import { WorkItemQuickAddComponent } from './work-item/work-item-quick-add/work-item-quick-add.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/work-item-list',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },{
    path: 'settings',
    component: SettingsComponent
  },
  
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: 'quick-add/:id',
    component: WorkItemQuickAddComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'code',
    component: CodeComponent
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'pipeline',
    component: PipelineComponent
  },
  {
    path: 'hypothesis',
    component: HypothesisComponent
  }
  

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}