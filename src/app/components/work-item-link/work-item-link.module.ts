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

import { WorkItemLinkComponent } from './work-item-link.component';
import {
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName
} from '../../pipes/work-item-link-filters.pipe';

import { MockHttp } from '../../mock/mock-http';


let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    WorkItemService,
    AreaService,
    IterationService,
    GlobalSettings,
    EventService,
    {
      provide: HttpService,
      useExisting: MockHttp
     }
   ];
} else {
  providers = [
     WorkItemService,
     AreaService,
     IterationService,
     GlobalSettings,
     EventService
    ];
}

@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpModule
  ],
  declarations: [
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName
   ],
  exports:      [ WorkItemLinkComponent ],
  providers: providers
})
export class WorkItemLinkModule { }
