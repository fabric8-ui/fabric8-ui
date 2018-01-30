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
    if( this.groupTypesService.getCurrentGroupName() === this.witGroup )
      this.checkUrl();
    else
      this.clearSelected();

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
      this.groupTypesService.groupTypeSelected.subscribe(wiTypeCollection => {
        // console.log('listener for groupTypeSelected1', this.groupTypesService.getCurrentGroupName());
        // console.log('listener for groupTypeSelected2', this.witGroup);
        // if( this.groupTypesService.getCurrentGroupName() !== this.witGroup )
        //   this.clearSelected();
        // else
        //   this.checkUrl();
      })
    );
  }

  setGuidedTypeWI(iteration) {
    this.selectedIteration = iteration;
    this.groupTypesService.setCurrentGroupType(this.collection, 'Execution');
  }

  clearSelected() {
    this.selectedIteration = {} as IterationModel;
  }

  checkUrl() {
    const queryParams = this.route.snapshot.queryParams;
    let urlArray = this.route.snapshot.queryParams['q'].split('iteration:');
    if (urlArray.length > 1 ) {
      let ind = urlArray[1].indexOf(' $AND ');
      let iterationId = '';
      if (ind >= 0) {
        iterationId = urlArray[1].substring(0,ind);
      } else {
        iterationId = urlArray[1].replace(')','');
      }
      let iteration = this.iterations.find( i => i.id === iterationId );
      this.setGuidedTypeWI(iteration);
    }
  }
}
