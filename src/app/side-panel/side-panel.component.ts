import { IterationModel } from './../models/iteration.model';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, Logger } from 'ngx-base';

import { WorkItem } from '../models/work-item';
import { WorkItemService } from '../work-item/work-item.service';

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

  backlogSelected: boolean = true;
  numberOfItemsInBacklog: number = 0;

  constructor(
    private log: Logger,
    private workItemService: WorkItemService,
    private router: Router,
    private broadcaster: Broadcaster) {
  }

  ngOnInit() {
    this.listenToEvents();
    this.refreshBacklogSize();
  }

  selectBacklog() {
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
    let filters: any = [{
      paramKey: 'filter[iteration]',
      active: false,
    }];
    // get the work item list with the "no iteration" filter, retrieve 
    // a pagesize of 1 (we are only interested in the meta fields) and
    // look only on the first result, then unsubscribe.
    this.workItemService.getWorkItems(1, filters).first()
      .subscribe((value:{workItems: WorkItem[], nextLink: string, totalCount: number | null}) => {
        this.log.log('Got backlog size of ' + value.totalCount);
        this.numberOfItemsInBacklog = value.totalCount;
      });
  }

  listenToEvents() {
    this.broadcaster.on<string>('iteration_selected')
      .subscribe(message => {
        this.backlogSelected = false;
    });
    this.broadcaster.on<any>('associate_iteration')
      .subscribe(message => {
        if (!message.currentIterationId && message.futureIterationId)
          this.numberOfItemsInBacklog--;
        else if (message.currentIterationId && !message.futureIterationId)
          this.numberOfItemsInBacklog++;
    });
    this.broadcaster.on<WorkItem>('delete_workitem')
      .subscribe(message => {
        if (!message.relationships.iteration.data)
          this.numberOfItemsInBacklog--;      
    });
    this.broadcaster.on<string>('create_workitem')
      .subscribe(message => {
        // if iteration is backlog
    });
  };
}
