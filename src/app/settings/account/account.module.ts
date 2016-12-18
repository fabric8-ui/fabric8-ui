import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AccountComponent }     from './account.component';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  imports:      [ CommonModule, AccountRoutingModule, HttpModule ],
  declarations: [ AccountComponent ],
})
export class AccountModule {
  constructor(http: Http) {}
}
