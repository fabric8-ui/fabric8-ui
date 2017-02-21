
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ng2-bootstrap';
import { ModalModule } from 'ng2-modal';
import { IterationModule } from './../iteration/iteration.module';
import { TypeModule } from './../type/type.module';
import { SidepanelComponent } from './side-panel.component';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    IterationModule,
    TypeModule,
    ModalModule
  ],
  declarations: [
    SidepanelComponent
  ],
  exports: [SidepanelComponent]
})
export class SidepanelModule { }
