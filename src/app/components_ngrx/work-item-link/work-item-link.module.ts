import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BsDropdownConfig,
  BsDropdownModule
} from 'ngx-bootstrap/dropdown';
import { WorkItemLinkTypeQuery } from './../../models/link-type';
import {
  GroupWorkItemLinks,
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName
} from './../../pipes/work-item-link-filters.pipe';
import { CommonSelectorModule } from './../common-selector/common-selector.module';
import { WorkItemLinkComponent } from './work-item-link.component';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    RouterModule,
    CommonSelectorModule
  ],
  declarations: [
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName,
    GroupWorkItemLinks
   ],
  exports: [ WorkItemLinkComponent ],
  providers: [
    BsDropdownConfig,
    WorkItemLinkTypeQuery
  ]
})
export class WorkItemLinkModule {}
