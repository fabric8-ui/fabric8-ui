import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComponent } from 'obsidian-generator-frontend/src/app/wizard/wizard.component';
import { IntroComponent } from 'obsidian-generator-frontend/src/app/wizard/intro/intro.component';

const routes: Routes = [
  {
    path: 'intro',
    component: IntroComponent,
    children: [
      {
        path: ''
      }
    ]
  },
  {
    path: 'wizard/:command',
    component: FormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObsidianRoutingModule { }