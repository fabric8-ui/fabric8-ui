import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { LoginComponent }     from './login.component';

@NgModule({
  imports:      [ CommonModule, HttpModule ],
  declarations: [ LoginComponent ],
})
export class LoginModule {}