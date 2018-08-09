import {
  ChangeDetectionStrategy, Component,
  EventEmitter, Input, OnInit,
  Output, ViewChild
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  SelectDropdownComponent
} from './../../widgets/select-dropdown/select-dropdown.component';

export type TypeaheadDropdownItem = {
  key: string;
  value: string;
  displayValue: string;
  selected: boolean;
};

export type TypeaheadDatasourceFunction =
  (string) => Observable<TypeaheadDropdownItem[]>;

@Component({
  selector: 'f8-typeahead-selector',
  templateUrl: './typeahead-selector.component.html',
  styleUrls: ['./typeahead-selector.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadSelectorComponent implements OnInit {
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;

  // This should be a function instance that returns
  // observable of formatted data for the dropdown
  @Input('dataSource') dataSource: TypeaheadDatasourceFunction;
  @Input('headerText') headerText: string = 'Default Header Text';
  @Input('noValueLabel') noValueLabel: string = 'None';
  @Input('allowUpdate') allowUpdate: boolean = true;
  @Input('allowMultiSelect') allowMultiSelect: boolean = false;
  @Input('closeOnSelect') closeOnSelect: boolean = true;
  @Input('selectedItems') set selectedItemsSetter(items: TypeaheadDropdownItem[]) {
    if (!Array.isArray(items)) {
      items = [];
    }
    this.selectedItems = items;
    this._selectedItems = [...this.selectedItems];
  }

  @Output() readonly onSelectItem: EventEmitter<any[]> = new EventEmitter();
  @Output() readonly onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() readonly onCloseSelector: EventEmitter<any[]> = new EventEmitter();

  private searchTermObs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private selectedItemsBs: BehaviorSubject<TypeaheadDropdownItem[]> =
    new BehaviorSubject<TypeaheadDropdownItem[]>([]);
  private selectedItemsObs = this.selectedItemsBs.asObservable().filter(i => Array.isArray(i));

  // this is only used for storing the data temporarily
  // not for visualization
  // we use the data coming in from the input for vusualization
  private _selectedItems: TypeaheadDropdownItem[] = [];

  // This is used to render the UI
  private selectedItems: TypeaheadDropdownItem[] = [];

  private searchValue: string = '';
  searching: boolean = false;
  isOpen: boolean = false;

  private menuItems: Observable<TypeaheadDropdownItem[]> =
    this.searchTermObs.asObservable()
    .do(term => this.searchValue = term)
    .switchMap((term) => {
      if (typeof(this.dataSource) === 'function'
        && term !== '') {
        return Observable.combineLatest(
            this.dataSource(term),
            this.selectedItemsObs
          )
          .map(([items, selectedItems]) => this.updateSelection(items, selectedItems))
          .do(v => this.searching = false);
      } else {
        return Observable.of([]);
      }
    });


  ngOnInit() {
  }

  updateSelection(items: TypeaheadDropdownItem[], selectedItems: TypeaheadDropdownItem[]) {
    const selectedItemsIds = selectedItems.map(i => i.key);
    items.forEach(item => {
      item.selected = selectedItemsIds.indexOf(item.key) > -1;
    });
    return items;
  }

  onSelect(event: TypeaheadDropdownItem) {
    if (event.key === null) { return; }
    if (!this.allowMultiSelect) {
      // empty the array and put the item clicked
      this._selectedItems = [event];
    } else {
      // find the index of the clicked item in the selected list
      const index = this._selectedItems.findIndex(i => i.key === event.key);
      // if the item clickd is already there then remove it
      if (index > -1) {
        this._selectedItems.splice(index, 1);
      } else { // enter the item in the array
        this._selectedItems.push(event);
      }
    }
    this.selectedItemsBs.next(this._selectedItems);
    this.onSelectItem.emit(this._selectedItems);
    if (this.closeOnSelect && !this.allowMultiSelect) {
      this.dropdownRef.closeDropdown();
    }
  }

  onSearch(event: string) {
    // Search on atleast 3 char or numeric
    if (event.trim().length >= 3 || !isNaN(parseInt(event.trim()))) {
      this.searchTermObs.next(event.trim());
      this.searching = true;
    } else {
      this.searchTermObs.next('');
    }
  }

  onOpen(event) {
    this.isOpen = true;
    this.onOpenSelector.emit();
  }

  onClose(event) {
    this.isOpen = false;
    this.dropdownRef.setSearchText('');
    // Empty the search results on close
    this.searchTermObs.next('');
    this.onCloseSelector.emit(this._selectedItems);
  }
}
