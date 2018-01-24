import { FilterService } from './../../services/filter.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy,
  TemplateRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';

import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { GroupTypesService } from '../../services/group-types.service';
import { IterationService } from '../../services/iteration.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { WorkItemService }   from '../../services/work-item.service';
import { IterationModel } from '../../models/iteration.model';
import { WorkItem } from '../../models/work-item';
import { FabPlannerIterationModalComponent } from '../iterations-modal/iterations-modal.component';
import { IterationTreeComponent } from '../iteration-tree/iteration-tree.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fab-planner-iteration',
  templateUrl: './iterations-panel.component.html',
  styleUrls: ['./iterations-panel.component.less']
})
export class IterationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() takeFromInput: boolean = false;
  @Input() iterations: IterationModel[] = [];
  @Input() collection = [];
  @Input() sidePanelOpen: Boolean = true;
  @Input() witGroup: string = '';

  @ViewChild('modal') modal: FabPlannerIterationModalComponent;

  authUser: any = null;
  loggedIn: Boolean = true;
  editEnabled: Boolean = false;
  isBacklogSelected: Boolean = true;
  barchatValue: number = 70;
  selectedIteration: IterationModel;
  allIterations: IterationModel[] = [];
  eventListeners: any[] = [];
  masterIterations;
  treeIterations;
  activeIterations:IterationModel[] = [];
  menuList: any[] = [];
  spaceId: string = '';

  private spaceSubscription: Subscription = null;

  constructor(
    private log: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private filterService: FilterService,
    private groupTypesService: GroupTypesService,
    private iterationService: IterationService,
    private notifications: Notifications,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private workItemDataService: WorkItemDataService,
    private workItemService: WorkItemService) {
    }

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.getAndfilterIterations();
    this.editEnabled = true;
    this.selectedIteration = {} as IterationModel;
    this.spaceSubscription = this.spaces.current.subscribe(space => {
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
    });
  }

  ngOnChanges() {
    if (this.takeFromInput) {
      // do not display the root iteration on the iteration panel.
      this.allIterations = [];
      for (let i=0; i<this.iterations.length; i++) {
        if (!this.iterationService.isRootIteration(this.iterations[i])) {
          this.allIterations.push(this.iterations[i]);
        }
      }
      this.clusterIterations();
      this.treeIterations = this.iterationService.getTopLevelIterations(this.allIterations);
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
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

  getAndfilterIterations() {
    if (this.takeFromInput) {
      // do not display the root iteration on the iteration panel.
      this.allIterations = [];
      for (let i=0; i<this.iterations.length; i++) {
        if (!this.iterationService.isRootIteration(this.iterations[i])) {
          this.allIterations.push(this.iterations[i]);
        }
      }
      this.clusterIterations();
    } else {
      this.iterationService.getIterations()
        .subscribe((iterations) => {
          // do not display the root iteration on the iteration panel.
          this.allIterations = [];
          for (let i=0; i<iterations.length; i++) {
            if (!this.iterationService.isRootIteration(iterations[i])) {
              this.allIterations.push(iterations[i]);
            }
          }
          this.clusterIterations();
        },
        (e) => {
          console.log('Some error has occured', e);
        });
    }
  }

  clusterIterations() {
    this.activeIterations = this.allIterations.filter((iteration) => iteration.attributes.active_status === true);
  }

  resolvedName(iteration: IterationModel) {
    return iteration.attributes.resolved_parent_path + '/' + iteration.attributes.name;
  }

  //This function is called after the iteration modal closes.
  onCreateOrupdateIteration(iteration: IterationModel) {
    let index = this.allIterations.findIndex((it) => it.id === iteration.id);
    if (index >= 0) {
      this.allIterations[index] = iteration;
      //if iteration is a child iteration update that content
      let parent = this.iterationService.getDirectParent(iteration, this.allIterations);
      if( parent != undefined ) {
        let parentIndex = this.allIterations.findIndex(i => i.id === parent.id);
        let childIndex = this.allIterations[parentIndex].children.findIndex(child => child.id === iteration.id);
        this.allIterations[parentIndex].children[childIndex] = iteration;
      }
    } else {
      this.allIterations.splice(this.allIterations.length, 0, iteration);
      //Check if the new iteration has a parent
      if (!this.iterationService.isTopLevelIteration(iteration)) {
        let parent = this.iterationService.getDirectParent(iteration, this.allIterations);
        let parentIndex = this.allIterations.findIndex(i => i.id === parent.id);
        if(!this.allIterations[parentIndex].children) {
          this.allIterations[parentIndex].children = [];
          this.allIterations[parentIndex].hasChildren = true;
        }
        this.allIterations[parentIndex].children.push(iteration);
      }
      let childIterations = this.iterationService.checkForChildIterations(iteration, this.allIterations);
      if(childIterations.length > 0) {
        this.allIterations[this.allIterations.length].hasChildren = true;
        this.allIterations[this.allIterations.length].children = childIterations;
      }
    }
    this.treeIterations = this.iterationService.getTopLevelIterations(this.allIterations);
    this.clusterIterations();
    this.iterationService.emitCreateIteration(iteration);
  }

  updateItemCounts() {
    this.log.log('Updating item counts..');
    this.iterationService.getIterations().first().subscribe((updatedIterations:IterationModel[]) => {
      // updating the counts from the response. May not the best solution on performance right now.
      updatedIterations.forEach((thisIteration:IterationModel) => {
        for (let i=0; i<this.iterations.length; i++) {
          if (this.iterations[i].id === thisIteration.id) {
            this.iterations[i].relationships.workitems.meta.total = thisIteration.relationships.workitems.meta.total;
            this.iterations[i].relationships.workitems.meta.closed = thisIteration.relationships.workitems.meta.closed;
          }
        }
      });
    }, err => console.log(err));
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
        this.workItemDataService.setItem(workItem);
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

  setGuidedTypeWI(iteration) {
    this.selectedIteration = iteration;
    this.groupTypesService.setCurrentGroupType(this.collection, 'execution');
  }

  clearSelected() {
    this.selectedIteration = {} as IterationModel;
  }

 }
