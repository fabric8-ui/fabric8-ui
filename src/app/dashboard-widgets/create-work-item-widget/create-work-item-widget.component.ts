import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';

@Component({
  selector: 'fabric8-create-work-item-widget',
  templateUrl: './create-work-item-widget.component.html',
  styleUrls: ['./create-work-item-widget.component.scss']
})
export class CreateWorkItemWidgetComponent implements OnInit {

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,

  ) { }

  ngOnInit() {
    this.context.current.subscribe(context => console.log('Context', context));
  }

}
