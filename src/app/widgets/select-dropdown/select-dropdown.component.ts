import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'f8-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.less']
})
export class SelectDropdownComponent implements OnInit {
  @Input() headerText: string = 'This is default header';
  @Input() toggleButtonRef: TemplateRef<any>;
  @Input() dropdownItem: TemplateRef<any>;
  @Input() dropdownFooter: TemplateRef<any>;
  @Input() menuItems: any[] = [];
  @Input() showSearch: boolean = false;

  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  private displayDropdown: boolean = false;

  ngOnInit() {
  }

  openDropdown() {
    this.displayDropdown = true;
  }
  closeDropdown() {
    this.displayDropdown = false;
  }

  selectItem(item: any) {
    this.onSelect.emit(item);
  }

  searchItem(text: string) {
    this.onSearch.emit(text);
  }
}
