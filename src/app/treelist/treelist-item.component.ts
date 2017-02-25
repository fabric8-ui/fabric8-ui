import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TreeNode } from 'angular2-tree-component';

// See docs: https://angular2-tree.readme.io/docs
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-tree-list-item',
  styles: [ require('./treelist-item.component.css').toString() ],
  template: require('./treelist-item.component.html')
})

export class TreeListItemComponent implements OnInit {
  @Input() node: TreeNode = null;
  @Input() template: TemplateRef<any>;

  @Output('onSelect') onSelect: EventEmitter<TreeListItemComponent> =
    new EventEmitter<TreeListItemComponent>();

  selected: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  select(event: MouseEvent): void {
    event.stopPropagation();
    this.onSelect.emit(this);
  }

  setSelected(select: boolean): void {
    this.selected = select;
  }

  isSelected(): boolean {
    return this.selected;
  }
}
