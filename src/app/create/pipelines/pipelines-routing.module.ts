import { RuntimeConsoleResolver } from './../runtime-console/runtime-console.resolver';
import { AuthGuard } from './../../shared/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipelinesComponent } from './pipelines.component';

const routes: Routes = [
  {
    path: '',
    component: PipelinesComponent,
    canActivate: [AuthGuard],
    resolve: {
      runtime: RuntimeConsoleResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PipelinesRoutingModule { }
