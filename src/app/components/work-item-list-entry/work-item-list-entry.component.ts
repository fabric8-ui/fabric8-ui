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
import { GroupTypesService } from '../../services/group-types.service';

import { IterationService } from '../../services/iteration.service';
import { LabelModel } from './../../models/label.model';
import { WorkItem }        from '../../models/work-item';
import { WorkItemService } from '../../services/work-item.service';

import { TreeListComponent } from 'patternfly-ng';

/**
 * Work Item List Entry Component - Displays a work item and action elements for it.
 *
 * Inputs: workItem:WorkItem - the WorkItem to be displayed.
 * Events: selectEvent(WorkItemListEntryComponent) - Entry is selected.
 * detailEvent(WorkItemListEntryComponent) - Detail view for entry is requested.
 * deleteEvent(WorkItemListEntryComponent) - Signals deletion (see note below!).
 *
 * Note: all navigational events are delegated to a parent component:
 * detailEvent, selectEvent. The parent component has the obligation to manually call
 * select() on this component! Why? Because this allows the parent component to customize
 * the select behaviour (like multi-selects or xor selects).
 *
 * All data events (deleteEvent only currently) are done inside this component (the service
 * is called to delete the workItem) and an event is delegated back to the parent for
 * information purposes. The parent MUST NOT delete the workItem associated. The event is
 * intended for display purposes, like removing the entry element and reloading the list.
 */

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-work-item-list-entry',
  templateUrl: './work-item-list-entry.component.html',
  styleUrls: ['./work-item-list-entry.component.less'],
})
export class WorkItemListEntryComponent implements OnInit, OnDestroy {
  @Input() listItem: TreeListComponent;
  @Input() workItem: WorkItem;
  @Input() iterations: IterationModel[];
  @Input() selected: boolean = false;
  //Retaining detail and preview events as they are not part of the tree's kebab menu
  @Output() detailEvent: EventEmitter<WorkItemListEntryComponent> = new EventEmitter<WorkItemListEntryComponent>();
  @Output() previewEvent: EventEmitter<WorkItem> = new EventEmitter<WorkItem>();
  @Output() clickLabel = new EventEmitter();

  checkedWI: boolean = false;
  dialog: Dialog;
  showDialog = false;
  loggedIn: Boolean = false;
  queryParams: Object = {};
  eventListeners: any[] = [];
  selectedItemId: string | number = 0;

  constructor(private auth: AuthenticationService,
              private broadcaster: Broadcaster,
              private groupTypesService: GroupTypesService,
              private route: ActivatedRoute,
              private iterationService: IterationService,
              private notifications: Notifications,
              private router: Router,
              private workItemService: WorkItemService,
              private logger: Logger) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
  }

  ngOnDestroy() {
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  constructUrl(workItem: WorkItem) {
    return this.router.url.split('plan')[0] + 'plan/detail/' +
      workItem.attributes['system.number'];
  }

  getWorkItem(): WorkItem {
    return this.workItem;
  }

  // helpers

  confirmDelete(event: MouseEvent) {
    event.stopPropagation();
    this.dialog = {
      'title': 'Confirm deletion of Work Item',
      'message': 'Are you sure you want to delete Work Item - ' + this.workItem.attributes['system.title'] + ' ?',
      'actionButtons': [
        {'title': 'Confirm', 'value': 1, 'default': false},
        {'title': 'Cancel', 'value': 0, 'default': true}
      ]
    } as Dialog;
    this.showDialog = true;
  }

  onButtonClick(val: number) {
    // callback from the confirm delete dialog
    if (val == 1) {
      this.onDelete(null);
    }
    this.showDialog = false;
  }

  // event handlers
  onDelete(event: MouseEvent): void {
    if (event)
      event.stopPropagation();
    this.workItemService.delete(this.workItem)
    .subscribe(() => {
      console.log('Deleted');
    });
  }

  onDetail(event: MouseEvent): void {
    event.stopPropagation();
    this.detailEvent.emit(this);
    this.router.navigateByUrl(this.router.url.split('detail')[0] + '/detail/' + this.workItem.id, { relativeTo: this.route });
  }

  onDetailPreview(event: MouseEvent): void {
    event.stopPropagation();
    this.previewEvent.emit(this.workItem);
  }

  selectDeselectFromUrl(url: string) {
    if (url.indexOf('detail') > -1) {
      this.selectedItemId = url.split('detail/')[1].split('?')[0];
    } else {
      this.selectedItemId = 0;
    }
    //this.listItem.setSelected(this.selectedItemId == this.workItem.id);
  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
      })
    )

    this.eventListeners.push(
      this.route.queryParams.subscribe((params) => {
        this.queryParams = params;
      })
    );

    this.selectDeselectFromUrl(this.router.url);
    this.eventListeners.push(
      this.router.events
      .filter((event) => event instanceof NavigationEnd )
      .map((event: NavigationEnd) => event.url)
      .subscribe(url => {
        this.selectDeselectFromUrl(url);
      })
    );
  }

  labelClick(event) {
    this.clickLabel.emit(event);
  }

}
