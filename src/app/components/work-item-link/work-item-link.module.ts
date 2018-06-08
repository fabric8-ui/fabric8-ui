import { EventService } from './../../services/event.service';
import { IterationService } from './../../services/iteration.service';
import { GlobalSettings } from '../../shared/globals';
import { AreaService } from './../../services/area.service';
import { HttpModule, Http }    from '@angular/http';
import { HttpService } from './../../services/http-service';
import { WorkItemService } from './../../services/work-item.service';
import { RouterModule } from '@angular/router';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { WorkItemLinkComponent } from './work-item-link.component';
import {
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName
} from '../../pipes/work-item-link-filters.pipe';

@NgModule({
  imports:      [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    RouterModule,
    HttpModule
  ],
  declarations: [
    WorkItemLinkComponent,
    // WorkItemLinkFilterByTypeName,
    // WorkItemLinkTypeFilterByTypeName
   ],
  exports:      [ WorkItemLinkComponent ],
  providers: [
    WorkItemService,
    AreaService,
    BsDropdownConfig,
    IterationService,
    GlobalSettings,
    EventService
  ]
})
export class WorkItemLinkModule { }
