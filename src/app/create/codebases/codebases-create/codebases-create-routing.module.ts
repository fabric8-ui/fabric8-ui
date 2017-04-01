import { CodebasesCreateComponent } from './codebases-create.component';
import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const codebasesCreateRoutes: Routes = [
  {
    path: 'add-codebase',
    component: CodebasesCreateComponent,
    outlet: 'overlay'
  }
];

@NgModule({
  imports: [ RouterModule.forChild(codebasesCreateRoutes) ],
  exports: [ RouterModule ]
})
export class CodebasesCreateRoutingModule {}
