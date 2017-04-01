import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';

@Component({
  selector: 'fabric8-edit-space-description-widget',
  templateUrl: './edit-space-description-widget.component.html',
  styleUrls: ['./edit-space-description-widget.component.scss']
})
export class EditSpaceDescriptionWidgetComponent implements OnInit {

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,

  ) { }

  ngOnInit() {
    this.context.current.subscribe(context => console.log('Context', context));
  }

}
