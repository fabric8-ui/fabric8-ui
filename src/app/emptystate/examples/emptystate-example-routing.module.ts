import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmptyStateExampleComponent } from './emptystate-example.component';

const routes: Routes = [{
  path: '',
  component: EmptyStateExampleComponent
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class EmptyStateExampleRoutingModule {}
