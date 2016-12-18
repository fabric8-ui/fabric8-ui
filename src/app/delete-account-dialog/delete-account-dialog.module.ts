import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { ModalModule } from 'ng2-modal';

import { DeleteAccountDialogComponent }   from './delete-account-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule ],
  declarations: [ DeleteAccountDialogComponent ],
  exports: [ DeleteAccountDialogComponent, ModalModule ]
})
export class DeleteAccountDialogModule { }
