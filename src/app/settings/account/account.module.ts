import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AccountComponent }     from './account.component';
import { AccountRoutingModule } from './account-routing.module';

import { DeleteAccountDialogModule }
    from '../../delete-account-dialog/delete-account-dialog.module';

@NgModule({
  imports:      [ CommonModule, AccountRoutingModule, HttpModule, DeleteAccountDialogModule ],
  declarations: [ AccountComponent ],
})
export class AccountModule {
  constructor(http: Http) {}
}
