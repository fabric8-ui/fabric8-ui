import { WorkItemNewDetailComponent } from './work-item-new-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: ':id',
    component: WorkItemNewDetailComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WorkItemNewDetailRoutingModule { }
