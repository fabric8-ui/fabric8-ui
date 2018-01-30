import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import { Space, Spaces } from 'ngx-fabric8-wit';
import { Subscription } from 'rxjs/Subscription';

import { FilterService } from '../../services/filter.service';
import { GroupTypesService } from '../../services/group-types.service';
import { IterationModel } from '../../models/iteration.model';

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
  @Input() witGroup: string = '';

  @Output() onEditIteration = new EventEmitter<IterationModel>();
  @Output() onCloseIteration = new EventEmitter<IterationModel>();
  @Output() onCreateIteration = new EventEmitter<IterationModel>();
  @Output() onSelectIteration = new EventEmitter<IterationModel>();


  loggedIn: Boolean = false;
  queryParams: Object = {};
  eventListeners: any[] = [];
  selectedItemId: string | number = 0;
  private spaceSubscription: Subscription = null;
  spaceId: string = '';

  constructor(private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private route: ActivatedRoute,
    private filterService: FilterService,
    private groupTypesService: GroupTypesService,
    private notifications: Notifications,
    private router: Router,
    private spaces: Spaces,
    private logger: Logger) {}

  ngOnInit(): void {
    this.loggedIn = this.auth.isLoggedIn();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        this.spaceId = space.id;
      }
    });
  }

  ngOnDestroy() {
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  setGuidedTypeWI(wiCollection, iteration) {
    this.onSelectIteration.emit(iteration);
    this.groupTypesService.setCurrentGroupType(wiCollection, 'Execution');
  }

  constructURL(iterationId: string) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('$WITGROUP', this.filterService.equal_notation, this.witGroup);
    //Query for space
    const space_query = this.filterService.queryBuilder('space',this.filterService.equal_notation, this.spaceId);
    //Query for iteration
    const iteration_query = this.filterService.queryBuilder('iteration',this.filterService.equal_notation, iterationId);
    //Join type and space query
    const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, space_query );
    const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query );
    const third_join = this.filterService.queryJoiner(second_join, this.filterService.and_notation, iteration_query);
    //this.setGroupType(witGroup);
    //second_join gives json object
    return this.filterService.jsonToQuery(third_join);
  }

  toggleChildrenDisplay(iteration) {
    iteration.showChildren = !iteration.showChildren;
  }

  editIteration(iteration) {
    this.onEditIteration.emit(iteration);
  }

  closeIteration(iteration) {
    this.onCloseIteration.emit(iteration);
  }

  createIteration(iteration) {
    this.onCreateIteration.emit(iteration);
  }

  calcDepth(iteration:IterationModel): string {
    let depth = ((iteration.attributes.parent_path).split('/')).length - 1;
    return 'depth-' + depth;
  }
}
