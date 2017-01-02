import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

import { ToggleService } from './toggle/toggle.service';

let toggleURL: string = '';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'signup',
    loadChildren: './signup/signup.module#SignupModule'
  },
  {
    path: toggleURL + 'pmuir/BalloonPopGame',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },
  {
    path: 'password_reset',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: toggleURL + 'pmuir/BalloonPopGame/plan',
    loadChildren: './plan/plan.module#PlanModule'
  },
  {
    path: toggleURL + 'pmuir/BalloonPopGame/create',
    loadChildren: './create/create.module#CreateModule'
  },
  {
    path: toggleURL + 'pmuir/BalloonPopGame/run',
    loadChildren: './run/run.module#RunModule'
  },
  {
    path: toggleURL + 'pmuir/BalloonPopGame/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },
  {
    path: toggleURL + 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  },
  {
    path: toggleURL + 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: toggleURL + 'help',
    loadChildren: './help/help.module#HelpModule'
  },
  {
    path: toggleURL + 'learn',
    loadChildren: './learn/learn.module#LearnModule'
  },
  {
    path: toggleURL + 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },
  {
    path: toggleURL + 'pmuir',
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: toggleURL + 'pmuir/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private toggleService: ToggleService) {
    toggleURL = toggleService.featureToggle.path;
  }
}
