import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { ToolbarModule } from 'patternfly-ng/toolbar';

import { CollaboratorService } from '../../services/collaborator.service';
import { EventService } from './../../services/event.service';
import { FilterService } from '../../services/filter.service';
import { WorkItemService } from '../../services/work-item.service';
import { ToolbarPanelComponent } from './toolbar-panel.component';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

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
    WorkItemService,
    EventService
  ],
  exports: [ToolbarPanelComponent]
})
export class ToolbarPanelModule { }
