import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Logger } from 'ngx-base';

import { WorkItem } from '../models/work-item';
import { WorkItemType } from '../models/work-item-type';

@Injectable()
export class WorkItemTypeControlService {
  
  // this properties/keys are considered fixed and will not be
  // displayed in the dynamic form area. They will be skipped 
  // when creating the FormGroup.
  private FIXED_PROPERTIES: string[] = [ 
    'system.area', 
    'system.assignees',
    'system.codebase', 
    'system.created_at', 
    'system.creator', 
    'system.description', 
    'system.iteration', 
    'system.order', 
    'system.remote_item_id', 
    'system.state', 
    'system.title', 
    'system.updated_at', 
  ];

  constructor(private log: Logger) { }

  toFormGroup(workItem: WorkItem) {
    let group: any = {};

    // if there is no type information attached, just return an empty group
    if (!workItem.relationalData || !workItem.relationalData.wiType) {
      this.log.warn('The work item ' + workItem.id + ' contains no normalized type information, no controls for form group can be created!');
      return group;
    }

    let fields = workItem.relationalData.wiType.attributes.fields;
    for (var key in fields) {
      if (this.FIXED_PROPERTIES.indexOf(key) != -1) {
        this.log.log('Skipping form control for ' + key);      
      } else {
        this.log.log('Generating form control for ' + key);
        group[key] = fields[key].required ? new FormControl('', Validators.required) : new FormControl('');
      }
    }

    return new FormGroup(group);
  }
}