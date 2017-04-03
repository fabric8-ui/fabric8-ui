import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from '../../config/action';
import { EmptyStateConfig } from '../emptystate-config';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'emptystate-example',
  styleUrls: ['./emptystate-example.component.scss'],
  templateUrl: './emptystate-example.component.html'
})
export class EmptyStateExampleComponent implements OnInit {

  actionsText: string = "";
  emptyStateConfig: EmptyStateConfig;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.emptyStateConfig = {
      actions: [{
        id: 'action1',
        name: 'Main Action',
        title: 'Start the server',
        type: 'main'
      },{
        id: 'action2',
        name: 'Secondary Action 1',
        title: 'Do the first thing'
      },{
        id: 'action3',
        name: 'Secondary Action 2',
        title: 'Do something else'
      },{
        id: 'action4',
        name: 'Secondary Action 3',
        title: 'Do something special'
      }],
      icon: 'pficon-warning-triangle-o',
      title: 'No Items Available',
      info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first " +
            "impression that helps users to achieve their goals. It should be used when a view is empty because no " +
            "objects exists and you want to guide the user to perform specific actions.",
      helpLink: {
        label: 'For more information please see the',
        urlLabel: 'EmptyState example',
        url: '/emptystate'
      }
    } as EmptyStateConfig;
  }

  ngDoCheck(): void {
  }

  // Actions

  performAction(action: Action): void {
    this.actionsText = action.name + "\n" + this.actionsText;
    let test = "";
  }
}
