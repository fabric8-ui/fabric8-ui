import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ng2-bootstrap';
import { ModalModule } from 'ngx-modal';
import { GroupTypesModule } from '../group-types-panel/group-types-panel.module';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { SidepanelComponent } from './side-panel.component';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    GroupTypesModule,
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
