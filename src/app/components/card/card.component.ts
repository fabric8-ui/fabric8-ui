import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'ngx-login-client';

import { WorkItem } from './../../models/work-item';
import { WorkItemService } from './../../services/work-item.service';

export class CardValue {
  id: string;
  type: string;
  title: string;
  hasLink: Boolean;
  avatar?: string;
  link?: string;
  menuItem?: Array<object>;
  extraData?: object;
}

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnInit, OnDestroy {

  @Input() cardValue: CardValue;

  @Output() menuClickEvent = new EventEmitter();

  private urlListener = null;
  private existingQueryParams: Object = {};

  constructor(
    private workItemService: WorkItemService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log(this.cardValue, '##$$##$$##$$');
    if (this.urlListener === null) {
     this.urlListener =
      this.route.queryParams.subscribe((params) => {
        this.existingQueryParams = params;
      });
    }
  }

  ngOnDestroy() {
    if (this.urlListener) {
      this.urlListener.unsubscribe();
      this.urlListener = null;
    }
  }

  kebabClick(event: any): void {
    event.stopPropagation();
  }

  kebabMenuClick(event: any, menuId: string): void {
    event.stopPropagation();
    this.menuClickEvent.emit(menuId);
  }

}
