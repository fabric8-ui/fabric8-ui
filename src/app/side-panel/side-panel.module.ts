import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ng2-bootstrap';
import { ModalModule } from 'ngx-modal';
import { IterationModule } from '../iteration/iteration.module';
import { SidepanelComponent } from './side-panel.component';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    IterationModule,
    ModalModule,
    RouterModule
  ],
  declarations: [
    SidepanelComponent
  ],
  exports: [SidepanelComponent]
})
export class SidepanelModule { }
