import { Component } from '@angular/core';

import { WorkItem, WorkItemRelations } from './../../models/work-item';
import { WorkItemService } from './../../services/work-item.service';
import { UserService } from 'ngx-login-client';


@Component({
  selector: 'work-item-detail',
  templateUrl: './work-item-new-detail.component.html',
  styleUrls: [ './work-item-new-detail.component.less' ]
})

export class WorkItemNewDetailComponent {
  workItem: WorkItem;

  constructor(
    private workItemService: WorkItemService,
    private userService: UserService
  ) {}

  createWorkItemObj(type: string) {
    this.workItem = new WorkItem();
    this.workItem.id = null;
    this.workItem.attributes = new Map<string, string | number>();
    this.workItem.attributes['system.description'] = '';
    this.workItem.attributes['system.description.rendered'] = '';
    this.workItem.relationships = new WorkItemRelations();
    this.workItem.type = 'workitems';
    this.workItem.relationships = {
      baseType: {
        data: {
          id: type,
          type: 'workitemtypes'
        }
      }
    } as WorkItemRelations;
    // Add creator
    this.userService.getUser()
      .subscribe(
        user => {
          this.workItem.relationships = Object.assign(
            this.workItem.relationships,
            {
              creator: {
                data: user
              }
            }
          );
        },
        err => console.log(err)
      );

    this.workItem.relationalData = {};
    this.workItemService.resolveType(this.workItem);
    this.workItem.attributes['system.state'] = 'new';
  }
}
