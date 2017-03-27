import {
  Component,
  EventEmitter,
  ElementRef,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
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
  selector: 'alm-listview-actions',
  styleUrls: ['./listview-actions.component.scss'],
  templateUrl: './listview-actions.component.html'
})
export class ListViewActionsComponent implements OnInit {
  @Input() config: ListViewConfig;
  @Input() itemExpandedTemplate: TemplateRef<any>;
  @Input() itemTemplate: TemplateRef<any>;

  //@ViewChild('listView') listView: ElementRef;

  prevConfig: ListViewConfig;

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
    this.prevConfig = _.cloneDeep(this.config);
  }

  // Actions

  getMenuClass(item: any): string {
    let menuClass = "";
    if (item.name === "Jim Brown") {
      menuClass = 'red';
    }
    return menuClass;
  }

  hideMenuActions(item: any): boolean {
    return (item.name === "Marie Edwards");
  }

  performAction($event: ListViewEvent): void {
    //this.actionsText = $event.item.name + " : " + $event.action.name + "\r\n" + this.actionsText;
  }

  startServer($event: ListViewEvent): void {
    //this.actionsText = $event.item.name + " : " + $event.action.name + "\r\n" + this.actionsText;
    $event.item.started = true;
  }
}
