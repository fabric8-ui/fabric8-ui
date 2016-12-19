// Temporary module which mocks out our signup web experience
// Long run, we probably want the signup experience to be built using a CMS
// Either dyamic like Drupal or static like scalate/awestruct/jekyll

import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SignupComponent }   from './signup.component';
import { SignupRoutingModule }   from './signup-routing.module';

@NgModule({
  imports:      [ CommonModule, SignupRoutingModule, HttpModule ],
  declarations: [ SignupComponent ]
})
export class SignupModule {
  constructor(http: Http) {}
}
