import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { ListViewConfig } from './listview-config';
import { ListViewEvent } from './listview-event';

import * as _ from 'lodash';

/**
 * List view component.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-listview',
  styleUrls: ['./listview.component.scss'],
  templateUrl: './listview.component.html'
})
export class ListViewComponent implements OnInit {
  @Input() config: ListViewConfig;
  @Input() itemExpandedTemplate: TemplateRef<any>;
  @Input() items: any[];
  @Input() itemTemplate: TemplateRef<any>;

  @Output('onCheckBoxChange') onCheckBoxChange = new EventEmitter();
  @Output('onClick') onClick = new EventEmitter();
  @Output('onDblClick') onDblClick = new EventEmitter();
  @Output('onDragEnd') onDragEnd = new EventEmitter();
  @Output('onDragMoved') onDragMoved = new EventEmitter();
  @Output('onDragStart') onDragStart = new EventEmitter();
  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onSelectionChange') onSelectionChange = new EventEmitter();

  dragItem: any;
  prevConfig: ListViewConfig;

  defaultConfig = {
    selectItems: false,
    multiSelect: false,
    dblClick: false,
    dragEnabled: false,
    selectedItems: [],
    selectionMatchProp: 'uuid',
    checkDisabled: false,
    useExpandingRows: false,
    showSelectBox: true
  } as ListViewConfig;

  constructor() {
  }

  // Initialization

  ngOnInit(): void {
    this.setupConfig();
  }

  ngDoCheck(): void {
    // Do a deep compare on config
    if (!_.isEqual(this.config, this.prevConfig)) {
      this.setupConfig();
    }
  }

  setupConfig(): void {
    if (this.config !== undefined) {
      _.defaults(this.config, this.defaultConfig);
    } else {
      this.config = _.cloneDeep(this.defaultConfig);
    }
    if (this.config && (this.config.multiSelect === undefined || this.config.multiSelect === false)
        && this.config.selectedItems && this.config.selectedItems.length > 0) {
      this.config.selectedItems = [this.config.selectedItems[0]];
    }
    if (this.config && this.config.selectItems && this.config.showSelectBox) {
      throw new Error('ListViewComponent - Illegal use: ' +
        'Cannot use both select box and click selection at the same time.');
    }
    this.prevConfig = _.cloneDeep(this.config);
  }

  // Checkbox

  checkBoxChange(item: any): void {
    this.onCheckBoxChange.emit({
      item: item
    } as ListViewEvent);
  }

  isSelected(item: any): boolean {
    let matchProp = this.config.selectionMatchProp;
    let selected = false;
    let i;

    if (this.config.showSelectBox) {
      selected = item.selected;
    } else if (this.config.selectItems && this.config.selectedItems.length) {
      this.config.selectedItems.forEach((itemObj) => {
        if (itemObj[matchProp] === item[matchProp]) {
          selected = true;
          return;
        }
      });
    }
    return selected;
  }

  // Drag and drop

  dragEnd(): void {
    this.onDragEnd.emit({
      item: this.dragItem
    } as ListViewEvent);
  }

  dragMoved(): void {
    this.onDragMoved.emit({
      item: this.dragItem
    } as ListViewEvent);
  }

  isDragOriginal(item: any): boolean {
    return (item === this.dragItem);
  }

  dragStart(item: any): void {
    this.dragItem = item;
    this.onDragStart.emit({
      item: this.dragItem
    } as ListViewEvent);
  }

  // Row Selection

  itemClick($event: MouseEvent, item: any): void {
    let alreadySelected;
    let selectionChanged = false;

    // Ignore disabled item clicks completely
    if (item.disabled === true) {
      return;
    }

    if (this.config && this.config.selectItems) {
      if (this.config.multiSelect && !this.config.dblClick) {
        for (let i = 0; i < this.config.selectedItems.length - 1; i++) {
          if (this.config.selectedItems[i] === item) {
            alreadySelected = true;
            break;
          }
        }
        if (alreadySelected) {
          // already selected so deselect
          this.config.selectedItems = _.without(this.config.selectedItems, item);
        } else {
          // add the item to the selected items
          this.config.selectedItems.push(item);
          selectionChanged = true;
        }
      } else {
        if (this.config.selectedItems[0] === item) {
          if (!this.config.dblClick) {
            this.config.selectedItems = [];
            selectionChanged = true;
          }
        } else {
          this.config.selectedItems = [item];
          selectionChanged = true;
        }
      }

      if (selectionChanged === true) {
        this.onSelect.emit({
          item: item
        } as ListViewEvent);
        this.onSelectionChange.emit({
          item: item,
          selectedItems: this.config.selectedItems
        } as ListViewEvent);
      }
    }
    this.onClick.emit({
      item: item
    } as ListViewEvent);
  }

  dblClick($event: MouseEvent, item: any): void {
    // Ignore disabled item clicks completely
    if (item.disabled !== true) {
      this.onDblClick.emit({
        item: item
      } as ListViewEvent);
    }
  }

  // Toggle

  toggleItemExpansion(item: any): void {
    if (item.rowExpansionDisabled !== true) {
      item.expanded = !item.expanded;
    }
  }
}
