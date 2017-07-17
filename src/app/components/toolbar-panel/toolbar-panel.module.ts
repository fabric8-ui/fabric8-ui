import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { CollaboratorService } from '../../services/collaborator.service';
import { FilterService } from '../../services/filter.service';
import { WorkItemService } from '../../services/work-item.service';
import { ToolbarPanelComponent } from './toolbar-panel.component';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

import { ToolbarModule } from 'patternfly-ng';

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    ToolbarModule,
    TooltipModule.forRoot(),
    WidgetsModule
  ],
  declarations: [
    ToolbarPanelComponent
  ],
  providers: [
    BsDropdownConfig,
    CollaboratorService,
    FilterService,
    TooltipConfig,
    WorkItemService
  ],
  exports: [ToolbarPanelComponent]
})
export class ToolbarPanelModule { }
