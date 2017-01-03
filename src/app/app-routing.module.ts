import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

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
    path: 'password_reset',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule'
  },

  // Analyze
  {
    path: 'pmuir/BalloonPopGame',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },
  {
    path: 'beta/pmuir/BalloonPopGame',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },
  {
    path: 'alpha/pmuir/BalloonPopGame',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },

  // Plan
  {
    path: 'pmuir/BalloonPopGame/plan',
    loadChildren: './plan/plan.module#PlanModule'
  },
  {
    path: 'beta/pmuir/BalloonPopGame/plan',
    loadChildren: './plan-alpha/plan.module#PlanModule'
  },
  {
    path: 'alpha/pmuir/BalloonPopGame/plan',
    loadChildren: './plan-alpha/plan.module#PlanModule'
  },

  // Create
  {
    path: 'pmuir/BalloonPopGame/create',
    loadChildren: './create/create.module#CreateModule'
  },
  {
    path: 'beta/pmuir/BalloonPopGame/create',
    loadChildren: './create/create.module#CreateModule'
  },
  {
    path: 'alpha/pmuir/BalloonPopGame/create',
    loadChildren: './create/create.module#CreateModule'
  },

  // Run
  {
    path: 'pmuir/BalloonPopGame/run',
    loadChildren: './run/run.module#RunModule'
  },
  {
    path: 'beta/pmuir/BalloonPopGame/run',
    loadChildren: './run/run.module#RunModule'
  },
  {
    path: 'alpha/pmuir/BalloonPopGame/run',
    loadChildren: './run/run.module#RunModule'
  },

  // Space-settings
  {
    path: 'pmuir/BalloonPopGame/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },
  {
    path: 'beta/pmuir/BalloonPopGame/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },
  {
    path: 'alpha/pmuir/BalloonPopGame/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },

  // Chat
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  },
  {
    path: 'beta/chat',
    loadChildren: './chat/chat.module#ChatModule'
  },
  {
    path: 'alpha/chat',
    loadChildren: './chat/chat.module#ChatModule'
  },

  // Dashboard
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'beta/dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'alpha/dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },

  // Help
  {
    path: 'help',
    loadChildren: './help/help.module#HelpModule'
  },
  {
    path: 'beta/help',
    loadChildren: './help/help.module#HelpModule'
  },
  {
    path: 'alpha/help',
    loadChildren: './help/help.module#HelpModule'
  },

  // Learn
  {
    path: 'learn',
    loadChildren: './learn/learn.module#LearnModule'
  },
  {
    path: 'beta/learn',
    loadChildren: './learn/learn.module#LearnModule'
  },
  {
    path: 'alpha/learn',
    loadChildren: './learn/learn.module#LearnModule'
  },

  // Notifications
  {
    path: 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },
  {
    path: 'beta/notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },
  {
    path: 'alpha/notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },

  // Profile
  {
    path: 'pmuir',
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: 'beta/pmuir',
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: 'alpha/pmuir',
    loadChildren: './profile/profile.module#ProfileModule'
  },

  // Settings
  {
    path: 'pmuir/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
  {
    path: 'beta/pmuir/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
  {
    path: 'alpha/pmuir/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
