import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Space, Contexts } from 'ngx-fabric8-wit';

import { Stack } from './../../../models/stack';

@Component({
  selector: 'alm-stack',
  templateUrl: 'stack-overview.component.html',
  styleUrls: ['./stack-overview.component.scss']
})
export class StackOverviewComponent implements OnInit {

  space: Space;

  private collapsed: Map<Stack, Boolean>;

  constructor(
    private router: Router,
    context: Contexts
  ) {
    this.collapsed = new Map();
    context.current.subscribe(val => {
      this.space = val.space;
      console.log('space', this.space);
    });
  }

  ngOnInit() {


  }

}
