import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SigninComponent }     from './signin.component';
import { SigninRoutingModule } from './signin-routing.module';

@NgModule({
  imports:      [ CommonModule, SigninRoutingModule, HttpModule ],
  declarations: [ SigninComponent ],
})
export class SigninModule {
  constructor(http: Http) {}
}