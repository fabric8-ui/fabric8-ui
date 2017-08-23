import { IterationModel } from '../../models/iteration.model';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnChanges, SimpleChanges, DoCheck, OnDestroy } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Event as NavigationEvent,
  NavigationStart,
  NavigationEnd
} from '@angular/router';

import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Dialog } from 'ngx-widgets';
import { IterationService } from '../../services/iteration.service';
import { TreeListItemComponent } from 'ngx-widgets';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'iteration-list-entry',
  templateUrl: './iteration-list-entry.component.html',
  styleUrls: ['./iteration-list-entry.component.less'],
})
export class IterationListEntryComponent implements OnInit, OnDestroy {
  @Input() listItem: TreeListItemComponent;
  @Input() iteration: any;
  @Input() selected: boolean = false;

  @Output() selectEvent: EventEmitter<IterationListEntryComponent> = new EventEmitter<IterationListEntryComponent>();

  loggedIn: Boolean = false;
  queryParams: Object = {};
  eventListeners: any[] = [];
  selectedItemId: string | number = 0;

  constructor(private auth: AuthenticationService,
              private broadcaster: Broadcaster,
              private route: ActivatedRoute,
              private iterationService: IterationService,
              private notifications: Notifications,
              private router: Router,
              private logger: Logger) {}

  ngOnInit(): void {
    //this.listenToEvents();
    console.log('teration = ', this.iteration);
    this.loggedIn = this.auth.isLoggedIn();
  }

  ngOnDestroy() {
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  select(): void {
    this.listItem.setSelected(true);
  }

  deselect(): void {
    this.listItem.setSelected(false);
  }



  selectEntry(): void {
    this.selectEvent.emit(this);
  }

  onSelect(event: MouseEvent): void {
    event.stopPropagation();
    this.selectEvent.emit(this);
  }

}
