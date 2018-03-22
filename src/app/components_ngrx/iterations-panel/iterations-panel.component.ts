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
import { IterationUI } from '../../models/iteration.model';
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

  @ViewChild('modal') modal: FabPlannerIterationModalComponent;

  authUser: any = null;
  loggedIn: boolean = true;
  editEnabled: boolean = false;
  barchatValue: number = 70;
  selectedIteration: IterationUI;
  allIterations: IterationUI[] = [];
  eventListeners: any[] = [];
  treeIterations: IterationUI[] = [];
  activeIterations:IterationUI[] = [];
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
    private store: Store<AppState>) {
    }

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.editEnabled = true;
    this.selectedIteration = {} as IterationUI;
    this.spaceSubscription = this.store
      .select('listPage')
      .select('space')
      .subscribe(space => {
        if (space) {
          console.log('[IterationComponent] New Space selected: ' + space.attributes.name);
          console.log('collection is ', this.collection);
          this.spaceId = space.id;
          this.editEnabled = true;
          this.getAndfilterIterations();
        } else {
          console.log('[IterationComponent] Space deselected.');
          this.editEnabled = false;
          this.allIterations = [];
          this.activeIterations = [];
        }
      })
  }

  ngOnChanges() {
    if (this.takeFromInput) {
      // do not display the root iteration on the iteration panel.
      this.allIterations = [];
      for (let i=0; i<this.iterations.length; i++) {
        if (!this.iterationService.isRootIteration(this.iterations[i].parentPath)) {
          this.allIterations.push(this.iterations[i]);
        }
      }
      this.clusterIterations();
      this.treeIterations = this.iterationService.getTopLevelIterations2(this.allIterations);
    }
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

  getAndfilterIterations() {
    if (this.takeFromInput) {
      // do not display the root iteration on the iteration panel.
      this.allIterations = [];
      for (let i=0; i<this.iterations.length; i++) {
        if (!this.iterationService.isRootIteration(this.iterations[i].parentPath)) {
          this.allIterations.push(this.iterations[i]);
        }
      }
      this.clusterIterations();
      this.treeIterations =
            this.iterationService.getTopLevelIterations2(this.allIterations);
    } else {
      this.eventListeners.push(
        this.store
          .select('listPage')
          .select('iterations')
          .filter(iterations => !!iterations.length)
          .subscribe((iterations: IterationState) => {
            // do not display the root iteration on the iteration panel.
            this.allIterations = iterations.filter(i => {
              return !this.iterationService.isRootIteration(i.parentPath);
            });
            this.clusterIterations();
            this.treeIterations =
              this.iterationService.getTopLevelIterations2(this.allIterations);
            if (!this.startedCheckingURL) {
              this.checkURL();
            }
          },
          (e) => {
            console.log('Some error has occured', e);
          })
        );
    }
  }

  clusterIterations() {
    this.activeIterations = this.allIterations.filter((iteration: IterationUI) => iteration.isActive);
  }

  updateItemCounts() {
    // this.log.log('Updating item counts..');
    // this.iterationService.getIterations().first().subscribe((updatedIterations: IterationUI[]) => {
    //   // updating the counts from the response. May not the best solution on performance right now.
    //   updatedIterations.forEach((thisIteration:IterationUI) => {
    //     for (let i=0; i<this.iterations.length; i++) {
    //       if (this.iterations[i].id === thisIteration.id) {
    //         this.iterations[i].workItemTotalCount = thisIteration.workItemTotalCount;
    //         this.iterations[i].workItemClosedCount = thisIteration.workItemClosedCount;
    //       }
    //     }
    //   });
    // }, err => console.log(err));
  }

  assignWIToIteration(workItemId: string, reqVersion: number, iterationID: string, selfLink: string) {
    let workItemPayload: WorkItem = {
      id: workItemId,
      type: 'workitems',
      attributes: {
        'version': reqVersion
      },
      relationships: {
        iteration: {
          data: {
            id: iterationID,
            type: 'iteration'
          }
        }
      },
      links: {
        self: selfLink
      }
    } as WorkItem;

    this.workItemService.update(workItemPayload)
      .switchMap(item => {
        return this.iterationService.getIteration(item.relationships.iteration)
          .map(iteration => {
            item.relationships.iteration.data = iteration;
            return item;
          });
      })
      .subscribe(workItem => {
        this.iterationService.emitDropWI(workItem);
        this.updateItemCounts();
        try {
        this.notifications.message({
            message: workItem.attributes['system.title']+' has been associated with '+workItem.relationships.iteration.data.attributes['name'],
            type: NotificationType.SUCCESS
          } as Notification);
        } catch(error) {
          console.log('Error in displaying notification. work item associated with iteration.');
        }
      },
      (err) => {
        this.iterationService.emitDropWI(workItemPayload, true);
        try {
          this.notifications.message({
            message: 'Something went wrong. Please try again',
            type: NotificationType.DANGER
          } as Notification);
        } catch(error) {
          console.log('Error in displaying notification. Error in work item association with iteration.');
        }
      })
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
      this.broadcaster.on<string>('backlog_selected')
        .subscribe(message => {
          this.selectedIteration = null;
      })
    );
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
          this.authUser = null;
      })
    );
    this.eventListeners.push(
      this.broadcaster.on<string>('wi_change_state_it')
        .subscribe((actions: any) => {
          this.updateItemCounts();
      })
    );
    this.eventListeners.push(
      this.broadcaster.on<string>('associate_iteration')
        .subscribe((data: any) => {
          this.updateItemCounts();
      })
    );

    this.eventListeners.push(
      this.broadcaster.on<WorkItem>('create_workitem')
        .subscribe((data: WorkItem) => {
          this.updateItemCounts();
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
            const selectedIteration =
              this.allIterations.find(it => it.id === selectedIterationID);
            if (!selectedIteration.selected) {
              this.store.dispatch(new IterationActions.Select(selectedIteration));
            }
          } else {
            this.store.dispatch(new IterationActions.Select());
          }
        }
      })
    );
  }
}
