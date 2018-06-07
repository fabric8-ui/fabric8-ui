import { Params, ActivatedRoute } from '@angular/router';
import {
  Component, OnInit, OnDestroy,
  TemplateRef, Input, OnChanges,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { GroupTypesService } from '../../services/group-types.service';
import { IterationService } from '../../services/iteration.service';
import { WorkItemService }   from '../../services/work-item.service';
import { FilterService } from './../../services/filter.service';
import { IterationUI, IterationQuery } from '../../models/iteration.model';
import { WorkItem } from '../../models/work-item';
import { FabPlannerIterationModalComponent } from '../iterations-modal/iterations-modal.component';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import { IterationState, IterationUIState } from './../../states/iteration.state';
import * as IterationActions from './../../actions/iteration.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fab-planner-iteration',
  templateUrl: './iterations-panel.component.html',
  styleUrls: ['./iterations-panel.component.less']
})
export class IterationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() takeFromInput: boolean = false;
  @Input() iterations: IterationUI[] = [];
  @Input() collection = [];
  @Input() sidePanelOpen: boolean = true;
  @Input() witGroup: string = '';
  @Input() showTree: string = '';
  @Input() showCompleted: string = '';
  @Input() infotipText: string = '';

  @ViewChild('modal') modal: FabPlannerIterationModalComponent;

  authUser: any = null;
  loggedIn: boolean = true;
  editEnabled: boolean = false;
  barchatValue: number = 70;
  eventListeners: any[] = [];
  treeIterations: Observable<IterationUI[]> = 
    this.iterationQuery.getIterationForTree()
    .filter(i => !!i.length)
    .do(i => {
      if(!this.startedCheckingURL){
        this.checkURL();
      }
    });
  activeIterations: Observable<IterationUI[]> = 
    this.iterationQuery.getActiveIterations();
  spaceId: string = '';
  startedCheckingURL: boolean = false;

  private spaceSubscription: Subscription = null;

  constructor(
    private log: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private filterService: FilterService,
    private iterationService: IterationService,
    private notifications: Notifications,
    private route: ActivatedRoute,
    private workItemService: WorkItemService,
    private store: Store<AppState>,
    private iterationQuery: IterationQuery) {
    }

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.editEnabled = true;
    this.spaceSubscription = this.store
      .select('listPage')
      .select('space')
      .subscribe(space => {
        if (space) {
          console.log('[IterationComponent] New Space selected: ' + space.attributes.name);
          console.log('collection is ', this.collection);
          this.spaceId = space.id;
          this.editEnabled = true;
        } else {
          console.log('[IterationComponent] Space deselected.');
          this.editEnabled = false;
        }
      })
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  constructURL(iterationId: string) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('typegroup.name', this.filterService.equal_notation, this.witGroup);
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

  addRemoveQueryParams(iterationId: string) {
    if (this.showCompleted && this.showTree) {
      return {
        q: this.constructURL(iterationId),
        showTree: this.showTree,
        showCompleted: this.showCompleted
      }
    } else if (this.showTree) {
      return {
        q: this.constructURL(iterationId),
        showTree: this.showTree
      }
    } else if (this.showCompleted) {
      return {
        q: this.constructURL(iterationId),
        showCompleted: this.showCompleted
      }
    } else {
      return {
        q: this.constructURL(iterationId)
      }
    }
  }



  kebabMenuClick(event: Event) {
    event.stopPropagation();
  }

  onEdit(iteration) {
    this.modal.openCreateUpdateModal('update', iteration);
  }

  onClose(iteration) {
    this.modal.openCreateUpdateModal('close', iteration);
  }

  onCreateChild(iteration) {
    this.modal.openCreateUpdateModal('createChild', iteration);
  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
          this.authUser = null;
      })
    );
  }

  checkURL() {
    this.startedCheckingURL = true;
    this.eventListeners.push(
      this.route.queryParams.subscribe(val => {
        if (val.hasOwnProperty('q')) {
          const selectedIterationID =
            this.filterService.getConditionFromQuery(val.q, 'iteration');
          if (selectedIterationID !== undefined) {
            this.store.dispatch(new IterationActions.Select(selectedIterationID));
          } else {
            this.store.dispatch(new IterationActions.Select());
          }
        }
      })
    );
  }
}
