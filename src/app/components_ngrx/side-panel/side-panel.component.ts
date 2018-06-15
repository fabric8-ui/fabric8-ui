import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Broadcaster, Logger } from 'ngx-base';
import { IterationUI } from '../../models/iteration.model';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';

@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.less']
})
export class SidepanelComponent implements OnInit {

  @Input() sidePanelOpen: boolean = true;

  backlogSelected: boolean = true;
  typeGroupSelected: boolean = true;

  constructor(
    private log: Logger,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>) {
  }

  ngOnInit() {}
  setGuidedTypeWI() {}
}
