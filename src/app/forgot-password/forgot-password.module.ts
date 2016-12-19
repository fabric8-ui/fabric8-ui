import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ForgotPasswordComponent }     from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';

@NgModule({
  imports:      [ CommonModule, ForgotPasswordRoutingModule, HttpModule ],
  declarations: [ ForgotPasswordComponent ],
})
export class ForgotPasswordModule {
  constructor(http: Http) {}
}