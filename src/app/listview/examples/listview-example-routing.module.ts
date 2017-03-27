import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListViewExampleComponent } from './listview-example.component';

const routes: Routes = [{
  path: '',
  component: ListViewExampleComponent
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ListViewExampleRoutingModule {}
