import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BsDropdownConfig,
  BsDropdownModule
} from 'ngx-bootstrap/dropdown';
import {
  GroupWorkItemLinks,
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName
} from '../../pipes/work-item-link-filters.pipe';
import { WorkItemLinkComponent } from './work-item-link.component';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    RouterModule
  ],
  declarations: [
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName,
    GroupWorkItemLinks
   ],
  exports: [ WorkItemLinkComponent ],
  providers: [BsDropdownConfig]
})
export class WorkItemLinkModule {}
