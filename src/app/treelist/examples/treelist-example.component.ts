import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  TreeNode,
  TREE_ACTIONS,
  IActionMapping,
} from 'angular2-tree-component';

import { Router } from '@angular/router';

import { TreeListComponent } from '../treelist.component';
import { TreeListItemComponent } from '../treelist-item.component';

// Default key actions
const actionMapping: IActionMapping = {
  mouse: {
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    click: (tree, node, $event) => {
      TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
    }
  }
};

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'treelist-example',
  styles: [ require('./treelist-example.component.css') ],
  template: require('./treelist-example.component.html')
})
export class TreeListExampleComponent implements OnInit {
  @ViewChild('treeListItemTemplate') treeListItemTemplate: TemplateRef<any>;
  @ViewChild('treeListLoadTemplate') treeListLoadTemplate: TemplateRef<any>;
  @ViewChild('treeListTemplate') treeListTemplate: TemplateRef<any>;
  @ViewChild('treeList') treeList: TreeListComponent;

  nodes: any[];
  selectedTreeListItem: TreeListItemComponent;

  asyncChildren = [{
    name: 'child2.1',
    subTitle: 'new and improved'
  },{
    name: 'child2.2',
    subTitle: 'new and improved2'
  }];

  // See: https://angular2-tree.readme.io/docs/options
  options = {
    actionMapping,
    allowDrag: true,
    isExpandedField: 'expanded',
    getChildren: this.getChildren.bind(this)
  };

  constructor(private router: Router) {
    setTimeout(() => {
      this.nodes = [{
        expanded: true,
        name: 'root expanded',
        subTitle: 'the root',
        children: [{
          name: 'child1',
          subTitle: 'a good child',
          hasChildren: false
        },{
          name: 'child2',
          subTitle: 'a bad child',
          hasChildren: false
        }]
      },{
        name: 'root2',
        subTitle: 'the second root',
        children: [{
          name: 'child2.1',
          subTitle: 'new and improved',
          hasChildren: false
        },{
          name: 'child2.2',
          subTitle: 'new and improved2',
          children: [{
            name: 'subsub',
            subTitle: 'subsub',
            hasChildren: false
          }]
        }]
      },{
        name: 'asyncroot',
        hasChildren: true
      }];
    }, 1);
  }

  ngOnInit(): void {
  }

  addNode(tree) {
    this.nodes[0].children.push({
      name: 'a new child'
    });
    tree.treeModel.update();
  }

  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }

  getChildren(node:any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.asyncChildren.map((c) => {
        return Object.assign({}, c, {
          hasChildren: node.level < 5
        });
      })), 1000);
    });
  }

  select(treeListItem: TreeListItemComponent): void {
    // de-select prior selected element (if any)
    if (this.selectedTreeListItem && this.selectedTreeListItem !== treeListItem) {
      this.selectedTreeListItem.setSelected(false);
    }
    treeListItem.setSelected(true);
    this.selectedTreeListItem = treeListItem;
  }
}
