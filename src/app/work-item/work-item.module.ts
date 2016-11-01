import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { WorkItemListModule }   from './work-item-list/work-item-list.module';
import { WorkItemDetailModule }   from './work-item-detail/work-item-detail.module';
import { WorkItemRoutingModule }   from './work-item-routing.module';

@NgModule({
  imports: [
    CommonModule,
    WorkItemListModule,
    WorkItemDetailModule,
    WorkItemRoutingModule
  ] 
})
export class WorkItemModule { }