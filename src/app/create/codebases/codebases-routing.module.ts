import { codebasesCreateRoutes } from './codebases-create/codebases-create-routing.module';
import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CodebasesComponent } from './codebases.component';

const routes: Routes = [
  {
    path: '',
    component: CodebasesComponent,
    children: codebasesCreateRoutes
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CodebasesRoutingModule {}
