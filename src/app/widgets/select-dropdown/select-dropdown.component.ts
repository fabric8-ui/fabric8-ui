import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  ElementRef
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
  @Input() disabled: boolean = false;

  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() onOpen: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor() {
  }


  private displayDropdown: boolean = false;

  ngOnInit() {
  }

  openDropdown() {
    if (!this.disabled) {
      this.displayDropdown = true;
      this.onOpen.emit('open');
    }
  }
  closeDropdown() {
    this.displayDropdown = false;
    this.onClose.emit('close');
  }

  selectItem(item: any) {
    this.onSelect.emit(item);
  }

  searchItem(text: string) {
    this.onSearch.emit(text);
  }

  clickOut() {
    if(this.displayDropdown) {
      this.closeDropdown();
    }
  }

  setSearchText(text: string) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = text;
    }
  }
}
