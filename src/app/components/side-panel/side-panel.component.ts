import { IterationModel } from '../../models/iteration.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Broadcaster, Logger } from 'ngx-base';

import { GroupTypesModel } from 'src/app/models/group-types.model';
import { GroupTypesService } from '../../services/group-types.service';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItemService } from '../../services/work-item.service';
import { IterationService } from '../../services/iteration.service';

@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.less']
})
export class SidepanelComponent implements OnInit, OnDestroy {

  @Input() iterations: IterationModel[] = [];
  @Input() sidePanelOpen: Boolean = true;
  @Input('groupTypes') set groupTypesSetup(types: GroupTypesModel[]) {
    if(JSON.stringify(this.groupTypes) != JSON.stringify(types)) {
      this.groupTypes = types;
    }
  }

  rootIteration: IterationModel = null;
  backlogSelected: boolean = true;
  typeGroupSelected: boolean = true;
  numberOfItemsInBacklog: number = 0;
  eventListeners: any[] = [];
  groupTypes: GroupTypesModel[] = [];

  constructor(
    private log: Logger,
    private groupTypesService: GroupTypesService,
    private workItemService: WorkItemService,
    private iterationService: IterationService,
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster) {
  }

  ngOnInit() {
    // retrieve the root iteration
    this.iterationService.getRootIteration()
    .subscribe((resultIteration:IterationModel) => {
      this.log.log('Got root iteration: ' + resultIteration.id);
      this.rootIteration = resultIteration;
      // after getting the root iteration, complete the initialization
      this.refreshBacklogSize();
      this.listenToEvents();
    }),
    (err) => {
      console.log('Error getting root iteration in the side panel');
    };
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  refreshBacklogSize() {
    // refreshing the root iteration size from service
    this.iterationService.getWorkItemCountInIteration(this.rootIteration).first().subscribe((count:number) => {
      this.log.log('Got root iteration size of ' + count);
      this.numberOfItemsInBacklog = count;
    })
  }

  setGuidedTypeWI() {
    let witCollection = this.workItemService.workItemTypes.map(wit => wit.id);
    this.groupTypesService.setCurrentGroupType(witCollection);
  }

  listenToEvents() {
    this.eventListeners = [
      this.broadcaster.on<any>('associate_iteration')
        .subscribe(message => {
          this.refreshBacklogSize();
      }),
      this.broadcaster.on<WorkItem>('delete_workitem')
        .subscribe(message => {
          this.refreshBacklogSize();
      }),
      this.broadcaster.on<string>('create_workitem')
        .subscribe(message => {
          this.refreshBacklogSize();
      }),

      this.route.queryParams.subscribe(params => {
        if (Object.keys(params).indexOf('q') > -1) {
          this.backlogSelected = false;
        } else {
          this.backlogSelected = true;
        }
      })
    ];
  }
}
