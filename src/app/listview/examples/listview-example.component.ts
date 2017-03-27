import {
  Component,
  ContentChild,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from '../../config/action';
import { ActionsConfig } from '../../config/actions-config';
import { EmptyStateConfig } from '../emptystate-config';
import { ListViewConfig } from "../listview-config";
import { ListViewEvent } from '../listview-event';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'listview-example',
  styleUrls: ['./listview-example.component.scss'],
  templateUrl: './listview-example.component.html'
})
export class ListViewExampleComponent implements OnInit {
  @ContentChild('itemTemplate') itemTemplate: TemplateRef<any>;
  @ContentChild('itemExpandedTemplate') itemExpandedTemplate: TemplateRef<any>;

  actionsConfig: ActionsConfig;
  actionsText: string = "";
  allItems: any[];
  dragItem: any;
  emptyStateConfig: EmptyStateConfig;
  items: any[];
  itemsAvailable: boolean = true;
  listViewConfig: ListViewConfig;
  selectType: string = 'checkbox';
  showDisabledRows: boolean = false;

  /* Todo: Create a template for button includes
  buttonInclude = '<span class="fa fa-plus"></span>{{actionButton.name}}';
  startButtonInclude = '<span ng-disabled="item.started">{{item.started ? "Starting" : "Start"}}</span>';
  */

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.allItems = [{
      name: "Fred Flintstone",
      address: "20 Dinosaur Way",
      city: "Bedrock",
      state: "Washingstone"
    },{
      name: "John Smith",
      address: "415 East Main Street",
      city: "Norfolk",
      state: "Virginia",
      rowExpansionDisabled: true
    },{
      name: "Frank Livingston",
      address: "234 Elm Street",
      city: "Pittsburgh",
      state: "Pennsylvania"
    },{
      name: "Linda McGovern",
      address: "22 Oak Street",
      city: "Denver",
      state: "Colorado"
    },{
      name: "Jim Brown",
      address: "72 Bourbon Way",
      city: "Nashville",
      state: "Tennessee"
    },{
      name: "Holly Nichols",
      address: "21 Jump Street",
      city: "Hollywood",
      state: "California"
    },{
      name: "Marie Edwards",
      address: "17 Cross Street",
      city: "Boston",
      state: "Massachusetts"
    },{
      name: "Pat Thomas",
      address: "50 Second Street",
      city: "New York",
      state: "New York"
    }];
    this.items = this.allItems;

    this.actionsConfig = {
      primaryActions: [{
        id: 'action1',
        name: 'Start',
        template: 'start-button-template',
        title: 'Start the server'
      },{
        id: 'action1',
        name: 'Action 1',
        title: 'Do the first thing'
      },{
        id: 'action1',
        name: 'Action 1',
        title: 'Do something else'
      },{
        id: 'action2',
        name: 'Action 2',
        template: 'my-button-template',
        title: 'Do something special'
      }],
      moreActions: [{
        id: 'moreActions1',
        name: 'Action',
        title: 'Perform an action'
      },{
        id: 'moreActions2',
        name: 'Another Action',
        title: 'Do something else'
      },{
        disabled: true,
        id: 'moreActions3',
        name: 'Disabled Action',
        title: 'Unavailable action',
      },{
        id: 'moreActions4',
        name: 'Something Else',
        title: ''
      },{
        id: 'moreActions5',
        name: '',
        separator: true
      },{
        id: 'moreActions6',
        name: 'Grouped Action 1',
        title: 'Do something'
      },{
        id: 'moreActions7',
        name: 'Grouped Action 2',
        title: 'Do something similar'
      }]
    } as ActionsConfig;

    this.emptyStateConfig = {
      icon: 'pficon-warning-triangle-o',
      title: 'No Items Available',
      info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first impression that helps users to achieve their goals. It should be used when a view is empty because no objects exists and you want to guide the user to perform specific actions.",
      helpLink: {
        label: 'For more information please see',
        urlLabel: 'pfExample',
        url: '#/api/patternfly.views.component:pfEmptyState'
      }
    } as EmptyStateConfig;

    this.listViewConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      selectionMatchProp: 'name',
      showSelectBox: true,
      useExpandingRows: false
    } as ListViewConfig;
  }

  ngDoCheck(): void {
  }

  // Actions

  handleSelect($event: ListViewEvent): void {
    this.actionsText = $event.item.name + ' selected\r\n' + this.actionsText;
  }

  handleSelectionChange($event: ListViewEvent): void {
    this.actionsText = $event.selectedItems.length + ' items selected\r\n' + this.actionsText;
  }

  handleClick($event: ListViewEvent): void {
    this.actionsText = $event.item.name + ' clicked\r\n' + this.actionsText;
  }

  handleDblClick($event: ListViewEvent): void {
    this.actionsText = $event.item.name + ' double clicked\r\n' + this.actionsText;
  }

  handleCheckBoxChange($event: ListViewEvent): void {
    this.actionsText = $event.item.name + ' checked: ' + $event.item.selected + '\r\n' + this.actionsText;
  }

  // Drag and drop

  handleDragEnd($event: ListViewEvent): void {
    this.actionsText = 'drag end\r\n' + this.actionsText;
  }

  handleDragMoved($event: ListViewEvent): void {
    let index = -1;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === this.dragItem) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      this.items.splice(index, 1);
    }
    this.actionsText = 'drag moved\r\n' + this.actionsText;
  }

  handleDragStart($event: ListViewEvent): void {
    this.dragItem = $event.item;
    this.actionsText = $event.item.name + ': drag start\r\n' + this.actionsText;
  }

  // Row selection

  updateDisabledRows(): void {
    this.items[1].disabled = this.showDisabledRows;
  }

  updateItemsAvailable(): void {
    this.items = (this.itemsAvailable) ? this.allItems : [];
  }

  updateSelectionType(): void {
    if (this.selectType === 'checkbox') {
      this.listViewConfig.selectItems = false;
      this.listViewConfig.showSelectBox = true;
    } else if (this.selectType === 'row') {
      this.listViewConfig.selectItems = true;
      this.listViewConfig.showSelectBox = false;
    } else {
      this.listViewConfig.selectItems = false;
      this.listViewConfig.showSelectBox = false;
    }
  }
}
