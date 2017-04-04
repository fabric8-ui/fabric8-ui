import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TreeNode } from 'angular-tree-component';

// See docs: https://angular2-tree.readme.io/docs
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-tree-list-item',
  styleUrls: ['./treelist-item.component.scss'],
  templateUrl: './treelist-item.component.html'
})

export class TreeListItemComponent implements OnInit {
  @Input() index: number = -1;
  @Input() node: TreeNode = null;
  @Input() template: TemplateRef<any>;

  @Output('onSelect') onSelect: EventEmitter<TreeListItemComponent> =
    new EventEmitter<TreeListItemComponent>();

  selected: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Return tree node. Useful to obtain the underlying objects (i.e., node.data) provided to tree list
   *
   * @returns {TreeNode}
   */
  getNode(): TreeNode {
    return this.node;
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
