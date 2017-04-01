import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { codebasesCreateRoutes } from './../../create/codebases/codebases-create/codebases-create-routing.module';

@NgModule({
  imports: [ RouterModule.forChild(codebasesCreateRoutes) ],
  exports: [ RouterModule ]
})
export class AddCodebaseWidgetRoutingModule {}
