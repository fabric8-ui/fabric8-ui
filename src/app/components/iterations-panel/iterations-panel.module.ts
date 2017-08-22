import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TreeModule } from 'angular2-tree-component';

import { CollapseModule } from 'ng2-bootstrap';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import {
  WidgetsModule,
  TreeListModule
} from 'ngx-widgets';

import { DragulaModule } from 'ng2-dragula';
import { FabPlannerIterationModalComponent } from '../iterations-modal/iterations-modal.component';
import { MyDatePickerModule } from 'mydatepicker';
import { IterationComponent } from './iterations-panel.component';
import { IterationService } from '../../services/iteration.service';
import { IterationListEntryComponent } from '../iteration-list-entry/iteration-list-entry.component';
import { TreeListComponent } from '../tree-list/tree-list.component'
import { TreeListItemComponent } from '../tree-list/tree-list-item.component'

import { ModalModule } from 'ngx-modal';
import { SwitchModule } from '../switch/switch.module';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { TruncateModule } from 'ng2-truncate';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule,
    CommonModule,
    DragulaModule,
    FormsModule,
    MyDatePickerModule,
    ModalModule,
    TooltipModule.forRoot(),
    TruncateModule,
    SwitchModule,
    WidgetsModule,
    RouterModule,
    TreeModule,
    TreeListModule
  ],
  declarations: [
    TreeListComponent,
    TreeListItemComponent,
    FabPlannerIterationModalComponent,
    IterationComponent,
    IterationListEntryComponent
  ],
  exports: [IterationComponent],
  providers: [BsDropdownConfig, IterationService, TooltipConfig]
})
export class IterationModule { }
