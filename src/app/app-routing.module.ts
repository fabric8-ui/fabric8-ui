import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },

  // Redirect login to public to cope with shared login module
  {
    path: 'login',
    redirectTo: 'public',
    pathMatch: 'full'
  },

  // Temporary page to control the app
  {
    path: '_control',
    loadChildren: './control/control.module#ControlModule'
  },

  // Home
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },

  // Analyze
  {
    path: 'pmuir/BalloonPopGame',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },

  // Plan
  {
    path: 'pmuir/BalloonPopGame/plan',
    loadChildren: './plan/plan.module#PlanModule'
  },

  // Create
  {
    path: 'pmuir/BalloonPopGame/create',
    loadChildren: './create/create.module#CreateModule'
  },

  // Run
  {
    path: 'pmuir/BalloonPopGame/run',
    loadChildren: './run/run.module#RunModule'
  },

  // Space-settings
  {
    path: 'pmuir/BalloonPopGame/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },

  // Profile
  {
    path: 'pmuir',
    loadChildren: './profile/profile.module#ProfileModule'
  },

  // Settings
  {
    path: 'pmuir/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
