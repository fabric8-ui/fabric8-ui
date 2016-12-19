import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

// import { DataResolver } from './app.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'pmuir/BalloonPopGame/analyze',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },
  {
    path: 'password_reset',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: 'pmuir/BalloonPopGame/analyze/plan',
    loadChildren: './plan/plan.module#PlanModule'
  },
  {
    path: 'pmuir/BalloonPopGame/analyze/create',
    loadChildren: './create/create.module#CreateModule'
  },
  {
    path: 'pmuir/BalloonPopGame/analyze/run',
    loadChildren: './run/run.module#RunModule'
  },
  {
    path: 'pmuir/BalloonPopGame/analyze/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'help',
    loadChildren: './help/help.module#HelpModule'
  },
  {
    path: 'learn',
    loadChildren: './learn/learn.module#LearnModule'
  },
  {
    path: 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },
  {
    path: 'pmuir/profile',
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: 'pmuir/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
