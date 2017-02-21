import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Broadcaster }       from './../shared/broadcaster.service';


@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidepanelComponent implements OnInit {


  constructor(
    private router: Router,
    private broadcaster: Broadcaster) {
  }

  ngOnInit() {
  }

  getWorkItemsByIteration(iteration: any) {
    let filters: any = [];
    filters.push({
      paramKey: 'filter[iteration]',
      active: false,
    });
    this.broadcaster.broadcast('unique_filter', filters);
  }
}
