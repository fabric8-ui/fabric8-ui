import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { DropdownOption } from "../dropdown/dropdown-option";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'demo-toolbar',
  styles: [ require('./toolbar.component.css') ],
  template: require('./toolbar.component.html')
})
export class ToolbarComponent implements OnInit {

  options: DropdownOption[];

  constructor(private router: Router) {}

  ngOnInit() {
    this.options = [{
      id: 1,
      option: 'option 1'
    }] as DropdownOption[];
  }
}
