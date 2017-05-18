import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig
} from 'ng2-bootstrap';

import { CollaboratorService } from '../../services/collaborator.service';
import { FilterService } from '../../services/filter.service';
import { WorkItemService } from '../../services/work-item.service';
import { ToolbarPanelComponent } from './toolbar-panel.component';

import {
  AlmEditableModule,
  AlmIconModule,
  ToolbarModule,
  WidgetsModule
} from 'ngx-widgets';

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    CommonModule,
    DropdownModule,
    ToolbarModule,
    WidgetsModule
  ],
  declarations: [
    ToolbarPanelComponent
  ],
  providers: [
    CollaboratorService,
    FilterService,
    ComponentLoaderFactory,
    DropdownConfig,
    PositioningService,
    TooltipConfig,
    WorkItemService
  ],
  exports: [ToolbarPanelComponent]
})
export class ToolbarPanelModule { }
