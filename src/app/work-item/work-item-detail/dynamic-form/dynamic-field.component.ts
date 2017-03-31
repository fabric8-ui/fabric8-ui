import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IMyOptions, IMyDateModel } from 'mydatepicker';

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
export class DynamicFieldComponent implements OnInit {

  // this is the type schema taken from the work item type.
  @Input() attributeDesc: any;

  // the created FormControl group for the above.
  @Input() form: FormGroup;

  // the work item we're dealing with.
  @Input() workItem: WorkItem;

  error: string;
  buttonsVisible: boolean = false;
  dateValue: IMyDateModel;

  datePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: false
  };

  ngOnInit(): void {
    console.log(this.workItem);
    if (this.attributeDesc.type.kind === 'instant') {
      // the datepicker we use does not support calling functions from the model attribute.
      this.dateValue = this.toDateModel(this.workItem.attributes[this.attributeDesc.key]);
    }
    // we don't need to listen for @Input changes to the work item, because the form will
    // be re-created from the schema on every load of a work item in the parent.
    // BUT: if we want to use this component on other dialogs that may not be re-created,
    // we might need to listen to changes using OnChanges().
  }

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

  getBooleanText(booleanValue: boolean): string {
    if (typeof booleanValue == 'undefined')
      return '&nbsp;';
    else if (booleanValue)
      return 'Yes';
    else
      return 'No';
  }

  onChangeBoolean(newOption: boolean) {
    if (newOption == null)
      this.form.value[this.attributeDesc.key] = undefined;
    else
      this.form.value[this.attributeDesc.key] = newOption;
    this.save();
  }

  onChangeMarkup(newMarkupValue: string) {
    if (newMarkupValue)
      this.form.value[this.attributeDesc.key] = newMarkupValue;
    this.save();
  }

  onDateChanged(newDate: IMyDateModel) {
    let date = newDate.jsdate.toISOString();
    this.form.value[this.attributeDesc.key] = date;
    this.save();
  }

  toDateModel(dateValue: string): any {
    if (!dateValue)
      return undefined;
    else {
      let date: Date = new Date(dateValue);
      let convertedDate = { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() } ;
      return convertedDate;      
    }
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
