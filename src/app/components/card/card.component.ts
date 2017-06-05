import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { User } from 'ngx-login-client';

import { WorkItem } from './../../models/work-item';
import { WorkItemService } from './../../services/work-item.service';

export class CardValue {
  id: string;
  type: string;
  title: string;
  avatar?: string;
  menuItem?: any;
}

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {

  @Input() cardValue: CardValue;

  @Output() isSelectedEvent: EventEmitter<CardComponent> = new EventEmitter<CardComponent>();
  @Output() menuClickEvent = new EventEmitter();

  constructor(
    private notifications: Notifications,
    private workItemService: WorkItemService,
    private route: ActivatedRoute
  ) {}

  private urlListener = null;
  private existingQueryParams: Object = {};

  ngOnInit() {
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
