import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Logger } from 'ngx-base';

import { WorkItemUI } from '../models/work-item';
import { WorkItemType } from '../models/work-item-type';

/**
 * This service provides a pre-processing of the type information attached to the WITs.
 * It is used by the dynamic form components to retrieve the type information and to
 * create the FormGroup.
 */
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
    'system.labels',
    'system.number'
  ];

  constructor(private log: Logger) { }

  /**
   * Validator for numbers only.
   */
  private numberValidator(): ValidatorFn {
    return Validators.pattern(/^\d+$/);
  }

 /**
  * Validator for enums.
  */
  private enumValidator(validValues: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      // if the value is empty, it is valid (add a required validator in toFormGroup() if required).
      if (!value)
        return null;
      const isInvalid = (validValues.indexOf(value) == -1);
      return isInvalid ? { 'forbiddenName': { value } } : null;
    };
  }

  // create the FormGroup with the FormControl instances
  toFormGroup(workItem: WorkItemUI) {
    let group: any = {};
    // if there is no type information attached, just return an empty group
    if (!workItem.type) {
      this.log.warn('The work item ' + workItem.id + ' contains no normalized type information, no controls for form group can be created!');
      return group;
    }
    let fields = workItem.type.fields;
    for (var key in fields) {
      if (this.FIXED_PROPERTIES.indexOf(key) != -1) {
        this.log.log('Skipping form control for ' + key);
      } else {
        this.log.log('Generating form control for ' + key);
        // create validators array
        let validators: ValidatorFn[] = [];
        if (fields[key].required)
          validators.push(Validators.required);
        if (fields[key].type.kind === 'integer' || fields[key].type.kind === 'float')
          validators.push(this.numberValidator());
        else if (fields[key].type.kind === 'enum')
          validators.push(this.enumValidator(fields[key].type.values));
        // finally create FormControl, put it into the group under the key
        group[key] = new FormControl(workItem[key] || '', validators);
      }
    }
    return new FormGroup(group);
  }

  // create an array of the type description objects to enable Angular to iterate over it using ngFor
  toAttributeArray(fields: any) {
    let resultArray: any[] = [];
    for (var key in fields) {
      if (this.FIXED_PROPERTIES.indexOf(key) != -1) {
        this.log.log('Skipping creating array entry form control for ' + key);
      } else {
        let thisElement = JSON.parse(JSON.stringify(fields[key]));
        thisElement.key = key;
        resultArray.push(thisElement);
      }
    }
    return resultArray;
  }
}
