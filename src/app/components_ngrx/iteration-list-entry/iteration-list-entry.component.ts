import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  ActivatedRoute,
  Event as NavigationEvent,
  NavigationEnd,
  NavigationStart,
  Router
} from '@angular/router';

import { Broadcaster, Logger, Notification, Notifications, NotificationType } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Dialog } from 'ngx-widgets';
import { Subscription } from 'rxjs/Subscription';

import { GroupTypeUI } from '../../models/group-types.model';
import { IterationUI } from '../../models/iteration.model';
import { FilterService } from '../../services/filter.service';
import { GroupTypesService } from '../../services/group-types.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'iteration-list-entry',
  templateUrl: './iteration-list-entry.component.html',
  styleUrls: ['./iteration-list-entry.component.less']
})
export class IterationListEntryComponent implements OnInit, OnDestroy {
  //@Input() listItem: TreeListItemComponent;
  @Input() iteration: IterationUI;
  @Input() selected: boolean = false;
  @Input() collection = [];
  @Input() witGroup: GroupTypeUI;
  @Input() showTree: string = '';
  @Input() showCompleted: string = '';
  @Input() context: 'list' | 'board'; // 'list' or 'board'

  @Output() readonly onEditIteration = new EventEmitter<IterationUI>();
  @Output() readonly onCloseIteration = new EventEmitter<IterationUI>();
  @Output() readonly onCreateIteration = new EventEmitter<IterationUI>();


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

  setGuidedTypeWI(wiCollection) {
    this.groupTypesService.setCurrentGroupType(wiCollection, 'execution');
  }

  constructURL(iterationId: string) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('typegroup.name', this.filterService.equal_notation, this.witGroup.name);
    //Query for iteration
    const iteration_query = this.filterService.queryBuilder('iteration', this.filterService.equal_notation, iterationId);
    //Join type and space query
    const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, type_query);
    const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, iteration_query);
    //this.setGroupType(witGroup);
    //second_join gives json object
    return this.filterService.jsonToQuery(second_join);
  }

  constructURLforBoard(iterationId: string) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('boardContextId', this.filterService.equal_notation, this.witGroup.id);
    //Query for iteration
    const iteration_query = this.filterService.queryBuilder('iteration', this.filterService.equal_notation, iterationId);
    // join type and iteration query
    const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, type_query);
    const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, iteration_query);
    return this.filterService.jsonToQuery(second_join);
  }

  addRemoveQueryParams(iterationId: string) {
    if (this.context === 'board') {
      return {
        q: this.constructURLforBoard(iterationId)
      };
    }
    if (this.showCompleted && this.showTree) {
      return {
        q: this.constructURL(iterationId),
        showTree: this.showTree,
        showCompleted: this.showCompleted
      };
    } else if (this.showTree) {
      return {
        q: this.constructURL(iterationId),
        showTree: this.showTree
      };
    } else if (this.showCompleted) {
      return {
        q: this.constructURL(iterationId),
        showCompleted: this.showCompleted
      };
    } else {
      return {
        q: this.constructURL(iterationId)
      };
    }
  }

  toggleChildrenDisplay(iteration) {
    // TODO: Dispatch an action to this
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
  calcDepth(iteration: IterationUI): string {
    let depth = ((iteration.parentPath).split('/')).length - 1;
    return 'depth-' + depth;
  }
}
