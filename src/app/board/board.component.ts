import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WorkItem } from '../work-item/work-item';
import { WorkItemService } from '../work-item/work-item.service';

@Component({
  selector: 'my-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  workItems: WorkItem[] = [];

  constructor(
    private router: Router,
    private workItemService: WorkItemService) {
  }

  ngOnInit() {
    this.workItemService.getWorkItems()
      .then(workItems => this.workItems = workItems);
  }

  gotoDetail(workItem: WorkItem) {
    let link = ['/detail', workItem.id];
    this.router.navigate(link);
  }
}
