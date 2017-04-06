import { IterationModel } from './../models/iteration.model';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, Logger } from 'ngx-base';

import { WorkItem } from '../models/work-item';
import { WorkItemService } from '../work-item/work-item.service';
import { IterationService } from '../iteration/iteration.service';

@Component({
  host:{
      'class':'app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidepanelComponent implements OnInit {

  @Input() iterations: IterationModel[] = [];

  rootIteration: IterationModel = null;
  backlogSelected: boolean = true;
  numberOfItemsInBacklog: number = 0;

  constructor(
    private log: Logger,
    private workItemService: WorkItemService,
    private iterationService: IterationService,
    private router: Router,
    private broadcaster: Broadcaster) {
  }

  ngOnInit() {
    // retrieve the root iteration
    this.iterationService.getRootIteration().first().subscribe((resultIteration:IterationModel) => {
      this.log.log('Got root iteration: ' + resultIteration.id);
      this.rootIteration = resultIteration;
      // after getting the root iteration, complete the initialization
      this.refreshBacklogSize();
      this.listenToEvents();
    });
  }

  selectBacklog() {
    this.log.log('Root iteration selected.');
    this.backlogSelected = true;
    let filters: any = [];
    filters.push({
      paramKey: 'filter[iteration]',
      active: false,
    });
    this.broadcaster.broadcast('unique_filter', filters);
    this.broadcaster.broadcast('backlog_selected', null);
  }

  refreshBacklogSize() {
    // refreshing the root iteration size from service
    this.iterationService.getWorkItemCountInIteration(this.rootIteration).first().subscribe((count:number) => {
      this.log.log('Got root iteration size of ' + count);
      this.numberOfItemsInBacklog = count;
    })
  }

  listenToEvents() {
    this.broadcaster.on<string>('iteration_selected')
      .subscribe(message => {
        this.backlogSelected = false;
    });
    this.broadcaster.on<any>('associate_iteration')
      .subscribe(message => {
        this.refreshBacklogSize();
    });
    this.broadcaster.on<WorkItem>('delete_workitem')
      .subscribe(message => {
        this.refreshBacklogSize();
    });
    this.broadcaster.on<string>('create_workitem')
      .subscribe(message => {
        this.refreshBacklogSize();
    });
  };
}
