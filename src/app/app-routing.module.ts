import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardComponent } from './board/board.component';
import { ChatComponent } from './chat/chat.component';
import { CodeComponent } from './code/code.component';
import { HomeComponent } from './home/home.component';
import { HypothesisComponent } from './hypothesis/hypothesis.component';
import { LoginComponent } from './login/login.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PipelineComponent } from './pipeline/pipeline.component';
import { SettingsComponent } from './settings/settings.component';
import { TestComponent } from './test/test.component';


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
    path: 'board',
    component: BoardComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'code',
    component: CodeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'hypothesis',
    component: HypothesisComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'pipeline',
    component: PipelineComponent
  },
  {
    path: 'quick-add/:id',
    component: WorkItemQuickAddComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'test',
    component: TestComponent
  }


];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}