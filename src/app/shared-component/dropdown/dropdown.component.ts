import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { DropdownOption } from './dropdown-option';

@Component({
  selector: 'pf-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() options: DropdownOption[];
  @Input() selected: DropdownOption;

  @Output('change') onUpdate = new EventEmitter();

  show: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggle(): void {
    this.show = !this.show;
  }

  open(): void {
    this.show = true;
  }

  close(): void {
    this.show = false;
  }

  onChange(option: DropdownOption): void {
    this.onUpdate.emit({
      currentOption: this.selected,
      newOption: option
    });
    this.toggle();
  }
}
