import { IterationModel } from '../../models/iteration.model';
import { Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  DoCheck,
  OnDestroy,
  ViewChild } from '@angular/core';
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
import { FilterService } from '../../services/filter.service';
import { GroupTypesService } from '../../services/group-types.service';
//import { TreeListItemComponent } from 'ngx-widgets';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'iteration-list-entry',
  templateUrl: './iteration-list-entry.component.html',
  styleUrls: ['./iteration-list-entry.component.less'],
})
export class IterationListEntryComponent implements OnInit, OnDestroy {
  //@Input() listItem: TreeListItemComponent;
  @Input() iteration: IterationModel;
  @Input() selected: boolean = false;
  @Input() collection = [];

  @Output() closeEvent: EventEmitter<IterationListEntryComponent> = new EventEmitter<IterationListEntryComponent>();

  loggedIn: Boolean = false;
  queryParams: Object = {};
  eventListeners: any[] = [];
  selectedItemId: string | number = 0;

  constructor(private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private route: ActivatedRoute,
    private filterService: FilterService,
    private groupTypesService: GroupTypesService,
    private notifications: Notifications,
    private router: Router,
    private logger: Logger) {}

  ngOnInit(): void {
    this.loggedIn = this.auth.isLoggedIn();
    console.log('iteration = ', this.iteration);
  }

  ngOnDestroy() {
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  onClose(event: MouseEvent): any {
    event.stopPropagation();
    this.closeEvent.emit(this);
  }

  setGuidedTypeWI(wiCollection) {
    this.groupTypesService.setCurrentGroupType(wiCollection);
  }

  constructURL(iterationId: string) {
    //return this.filterService.constructQueryURL('', {iteration_id: iterationId});
    //this.filterService.queryBuilder({}, '$IN',)
    const it_key = 'iteration';
    const it_compare = this.filterService.equal_notation;
    const it_value = iterationId;
    //Query for type
    const it_query = this.filterService.queryBuilder(it_key, it_compare, it_value);
    //Query for space
    //const space_query = this.filterService.queryBuilder('space',this.filterService.equal_notation, this.spaceId);
    //Join type and space query
    const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, it_query );

    //Iterations should only show allowed work item types
    const wi_key = 'workitemtype';
    const wi_compare = this.filterService.in_notation;
    const wi_value = this.collection;

    //Query for type
    const type_query = this.filterService.queryBuilder(wi_key, wi_compare, wi_value);
    const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query );
    //const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query );
    //second_join gives json object
    return this.filterService.jsonToQuery(second_join);
    //reverse function jsonToQuery(second_join);
    //return '';
  }
}
