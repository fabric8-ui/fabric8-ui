import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  TreeComponent
} from 'angular2-tree-component';

// See docs: https://angular2-tree.readme.io/docs
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-tree-list',
  styles: [ require('./treelist.component.css').toString() ],
  template: require('./treelist.component.html')
})

export class TreeListComponent implements OnInit {
  @Input() listTemplate: TemplateRef<any>;
  @Input() loadTemplate: TemplateRef<any>;
  @Input() nodes: any[] = null;
  @Input() options: any;
  @Input() showExpander: boolean = true;

  @ViewChild(TreeComponent) tree: TreeComponent;

  constructor() {
  }

  ngOnInit(): void {
  }

  // Helper function to update tree when moving items
  updateTree() {
    this.tree.treeModel.update();
  }
}
