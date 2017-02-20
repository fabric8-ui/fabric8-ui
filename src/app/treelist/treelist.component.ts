import { Component, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular2-tree-component';

// See docs: https://angular2-tree.readme.io/docs
@Component({
  selector: 'alm-tree-list',
  template: require('./treelist.component.html'),
  styles: [require('./treelist.component.css')],
  encapsulation: ViewEncapsulation.None
})

export class TreeListComponent {
  @Input() nodes: any[] = null;
  @Input() hideExpander: boolean;
  @Input() listTemplate: TemplateRef<any>;
  @Input() options:any;

  @ViewChild(TreeComponent) tree: TreeComponent;
  @ViewChild('treeNodeTemplate') listItemTemplate: TemplateRef<any>;

  // Default key actions
  actionMapping:IActionMapping = {
    mouse: {
      dblClick: (tree, node, $event) => {
        if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      },
      click: (tree, node, $event) => {
        TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
      }
    }
  };

  // Defaults
  defaultOptions = {
    actionMapping: this.actionMapping,
    nodeClass: (node: TreeNode) => {
      return 'tree-list';
    }
  }
  customOptions = this.defaultOptions;

  constructor() {
    // Override default options
    setTimeout(() => {
      Object.assign(this.customOptions, this.options);
    }, 1);
  }

  // Helper function to update tree when moving items
  updateTree() {
    this.tree.treeModel.update();
  }
}
