import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BsDropdownConfig,
  BsDropdownModule
} from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { WorkItemLinkComponent } from './work-item-link.component';
import {
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName,
  GroupWorkItemLinks
} from '../../pipes/work-item-link-filters.pipe';

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
