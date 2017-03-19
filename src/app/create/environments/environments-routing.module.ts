import { AuthGuard } from './../../shared/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnvironmentsComponent } from './environments.component';

const routes: Routes = [
  {
    path: '',
    component: EnvironmentsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvironmentsRoutingModule { }
