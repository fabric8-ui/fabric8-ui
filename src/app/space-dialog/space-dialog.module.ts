import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { ModalModule } from 'ng2-modal';

import { SpaceDialogComponent }   from './space-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule ],
  declarations: [ SpaceDialogComponent ],
  exports: [ SpaceDialogComponent, ModalModule ]
})
export class SpaceDialogModule { }
