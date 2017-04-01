import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';

@Component({
  selector: 'fabric8-analytical-report-widget',
  templateUrl: './analytical-report-widget.component.html',
  styleUrls: ['./analytical-report-widget.component.scss']
})
export class AnalyticalReportWidgetComponent implements OnInit {

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,

  ) { }

  ngOnInit() {
    this.context.current.subscribe(context => console.log('Context', context));
  }

}
