import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Broadcaster } from 'ngx-login-client';


@Component({
  host:{
      'class':"app-component flex-container in-column-direction flex-grow-1"
  },
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
