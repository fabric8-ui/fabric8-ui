import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { IterationService } from './iteration.service';
import { IterationModel } from './../models/iteration.model';
import { WorkItem } from './../models/work-item';

@Component({
  host: {
    'class':"app-component"
  },
  selector: 'fab-planner-iteration',
  templateUrl: './iteration.component.html',
  styleUrls: ['./iteration.component.scss']
})
export class IterationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() takeFromInput: boolean = false;
  @Input() iterations: IterationModel[] = [];

  authUser: any = null;
  loggedIn: Boolean = true;
  editEnabled: Boolean = false;
  isBacklogSelected: Boolean = true;
  isCollapsedIteration: Boolean = false;
  isCollapsedCurrentIteration: Boolean = false;
  isCollapsedFutureIteration: Boolean = true;
  isCollapsedPastIteration: Boolean = true;
  barchatValue: number = 70;
  selectedIteration: IterationModel;
  allIterations: IterationModel[] = [];
  futureIterations: IterationModel[] = [];
  currentIterations: IterationModel[] = [];
  closedIterations: IterationModel[] = [];

  private spaceSubscription: Subscription = null;

  constructor(
    private log: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private iterationService: IterationService,
    private route: ActivatedRoute,
    private spaces: Spaces
  ) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.getAndfilterIterations();
    this.editEnabled = true;
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[IterationComponent] New Space selected: ' + space.attributes.name);
        console.log(space);
        this.editEnabled = true;
        this.getAndfilterIterations();
      } else {
        console.log('[IterationComponent] Space deselected.');
        this.editEnabled = false;
        this.allIterations = [];
        this.futureIterations = [];
        this.currentIterations = [];
        this.closedIterations = [];
      }
    });
  }

  ngOnChanges() {
    if (this.takeFromInput) {
      this.allIterations = this.iterations;
      this.clusterIterations();
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  getAndfilterIterations() {
    if (this.takeFromInput) {
      this.allIterations = this.iterations;
      this.clusterIterations();
    } else {
      this.iterationService.getIterations()
      .subscribe((iterations) => {
          this.allIterations = iterations;
          this.clusterIterations();
      },
      (e) => {
        console.log('Some error has occured', e);
      });
    }
  }

  clusterIterations() {
    this.futureIterations = this.allIterations.filter((iteration) => iteration.attributes.state === 'new');
    this.currentIterations = this.allIterations.filter((iteration) => iteration.attributes.state === 'start');
    this.closedIterations = this.allIterations.filter((iteration) => iteration.attributes.state === 'close');
  }

  onCreateOrupdateIteration(iteration: IterationModel) {
    let index = this.allIterations.findIndex((it) => it.id === iteration.id);
    if (index >= 0) {
      this.allIterations[index] = iteration;
    } else {
      this.allIterations.splice(this.allIterations.length, 0, iteration);
    }
    this.clusterIterations();
  }

  getWorkItemsByIteration(iteration: IterationModel) {
    let filters: any = [];
    if (iteration) {
      this.selectedIteration = iteration;
      this.isBacklogSelected = false;
      filters.push({
        id:  iteration.id,
        name: iteration.attributes.name,
        paramKey: 'filter[iteration]',
        active: true,
        value: iteration.id
      });
      // emit event 
      this.broadcaster.broadcast('iteration_selected', iteration);
    } else {
      //This is to view the backlog
      this.selectedIteration = null;
      this.isBacklogSelected = true;
      //Collapse the other iteration sets
      this.isCollapsedCurrentIteration = true;
      this.isCollapsedFutureIteration = true;
      this.isCollapsedPastIteration = true;
      filters.push({
        paramKey: 'filter[iteration]',
        active: false,
      });
    }
    this.broadcaster.broadcast('unique_filter', filters);
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
    });
  }

  listenToEvents() {
    this.broadcaster.on<string>('backlog_selected')
      .subscribe(message => {
        this.selectedIteration = null;
        this.isBacklogSelected = true;
    });
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.authUser = null;
    });
    this.broadcaster.on<string>('wi_change_state_it')
      .subscribe((actions: any) => {
        this.updateItemCounts();
    });
    this.broadcaster.on<string>('associate_iteration')
      .subscribe((data: any) => {
        this.updateItemCounts();
    });
    this.broadcaster.on<WorkItem>('delete_workitem')
      .subscribe((data: WorkItem) => {
        this.updateItemCounts();
    });
  }
 }
