import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { Logger } from 'ngx-base';

export class TypeaheadDropdownValue {
  key: string; // key, will be returned by the event on selection.
  value: string; // value used as label in the dropdown.
  selected: boolean; // marks the selected entry, must be exactly once available.
  cssLabelClass?: string; // optional, will be set on the label in the dropdown.
}

/*
 * This component provides a typeahead dropdown. It accepts a list of possible values. 
 * The values must be provided using an array of TypeaheadDropdownValue instances 
 * containing key and value of the option. Exactly one of the values needs to have 
 * selected==true. The onUpdate event provides a key to enclosing components when 
 * an option is selected.
 */
@Component({
  selector: 'typeahead-dropdown',
  templateUrl: './typeahead-dropdown.component.html',
  styleUrls: ['./typeahead-dropdown.component.scss']
})
export class TypeaheadDropdown implements OnInit {

  // array of possible values
  @Input() protected values: TypeaheadDropdownValue[];

  // event when value is updated, emits new value as the event.
  @Output() protected onUpdate = new EventEmitter();

  @ViewChild('valueSearch') protected valueSearch: any;
  @ViewChild('valueList') protected valueList: any;

  protected filteredValues: TypeaheadDropdownValue[] = [];
  protected selectedValue: TypeaheadDropdownValue;
  protected searchValue: boolean = false;

  constructor(private logger: Logger) {    
  }

  ngOnInit(): void {
    this.filteredValues = cloneDeep(this.values);
  }

  protected open() {
    this.searchValue = true;
    // Takes a while to render the component
    setTimeout(() => {
      if (this.valueSearch) {
        this.valueSearch.nativeElement.focus();
      }
    }, 50);
  }

  public isOpen(): boolean {
    return this.searchValue;
  }

  public close(): void {
    this.searchValue = false;
  }

  protected getInitialValue() {
    for (let i=0; i<this.values.length; i++)
      if (this.values[i].selected)
        return this.values[i];
    return null;
  }

  // on clicking the area drop down option, the selected 
  // value needs to get displayed in the input box.
  protected showValueOnInput(value: TypeaheadDropdownValue): void {
    this.valueSearch.nativeElement.value = value.value;
    this.selectedValue = value;
  }

  // emits event to parent.
  protected setValue(): void {
    this.logger.log('Selected new value on TypeaheadDropdown: ' + this.selectedValue.key + ' (value: ' + this.selectedValue.value + ')');
    this.onUpdate.emit(this.selectedValue.key);
    this.close();
  }

  protected filterValue(event: any) {
    // Down arrow or up arrow
    if (event.keyCode == 40 || event.keyCode == 38) {
      let lis = this.valueList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i == lis.length) { // No existing selected
        if (event.keyCode == 40) { // Down arrow
          lis[0].classList.add('selected');
          lis[0].scrollIntoView(false);
        } else { // Up arrow
          lis[lis.length - 1].classList.add('selected');
          lis[lis.length - 1].scrollIntoView(false);
        }
      } else { // Existing selected
        lis[i].classList.remove('selected');
        if (event.keyCode == 40) { // Down arrow
          lis[(i + 1) % lis.length].classList.add('selected');
          lis[(i + 1) % lis.length].scrollIntoView(false);
        } else { // Down arrow
          // In javascript mod gives exact mod for negative value
          // For example, -1 % 6 = -1 but I need, -1 % 6 = 5
          // To get the round positive value I am adding the divisor
          // with the negative dividend
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].classList.add('selected');
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].scrollIntoView(false);
        }
      }
    } else if (event.keyCode == 13) { // Enter key event
      let lis = this.valueList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i < lis.length) {
        let selectedId = lis[i].dataset.value;
        this.selectedValue = lis[i];
        this.setValue();
      }
    } else {
      let inp = this.valueSearch.nativeElement.value.trim();
      this.filteredValues = this.values.filter((item) => {
         return item.value.toLowerCase().indexOf(inp.toLowerCase()) > -1;
      });
    }
  }
}