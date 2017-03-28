import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WorkItem } from '../../../models/work-item';

/*
 *  This class represents one single dynamic data field. It uses the
 *  Angular form facilities to create a form group and display the 
 *  control. If new data types should be supported, add them to this
 *  component.
 */
@Component({
  selector: 'alm-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss']
})
export class DynamicFieldComponent {

  // this is the type schema taken from the work item type.
  @Input() attributeDesc: any;

  // the created FormControl group for the above.
  @Input() form: FormGroup;

  // the work item we're dealing with.
  @Input() workItem: WorkItem;

  error: string;
  buttonsVisible: boolean = false;

  isValid() { 
    return this.form.controls[this.attributeDesc.key].valid; 
  }

  isButtonsVisible() { 
    return this.buttonsVisible; 
  }

  focusIn() {
    this.buttonsVisible = true;
  }
  
  focusOut() {
    this.buttonsVisible = false;
  }

  onChangeDropdown(newOption: string) {
    if (newOption == '&nbsp;')
      this.form.value[this.attributeDesc.key] = '';
    else
      this.form.value[this.attributeDesc.key] = newOption;
    this.save();
  }

  save() {
    try {
      // based on the data type, we're converting the data before storing it.
      if (this.attributeDesc.type.kind === 'integer') {
        let number: number = parseInt(this.form.value[this.attributeDesc.key]);
        if (isNaN(number))
          throw('invalid data for field - not an integer');
        else
          this.workItem.attributes[this.attributeDesc.key] = number;
      } else if (this.attributeDesc.type.kind === 'float') {
        let number: number = parseFloat(this.form.value[this.attributeDesc.key]);
        if (isNaN(number))
          throw('invalid data for field - not a float');
        else
          this.workItem.attributes[this.attributeDesc.key] = number;
      } else if (this.attributeDesc.type.kind === 'enum') {
        let value = this.form.value[this.attributeDesc.key];
        if (this.attributeDesc.type.values.indexOf(value) == -1)
          throw('invalid data for field - not in valid values');
        else
          this.workItem.attributes[this.attributeDesc.key] = value;
      } else {
        // default: treat value as string
        this.workItem.attributes[this.attributeDesc.key] = this.form.value[this.attributeDesc.key];        
      }
      this.error = null;
    } catch (error) {
      this.error = error;
    }
  }

  cancel() {
    // setting the form value to the (old) data value and mark it as pristine
    this.form.controls[this.attributeDesc.key].setValue(this.workItem.attributes[this.attributeDesc.key]);
    this.form.controls[this.attributeDesc.key].markAsPristine();
  }
}
