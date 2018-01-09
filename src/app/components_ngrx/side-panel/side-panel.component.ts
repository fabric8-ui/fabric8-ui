import { IterationModel } from '../../models/iteration.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Broadcaster, Logger } from 'ngx-base';
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
  numberOfItemsInBacklog: number = 0;

  constructor(
    private log: Logger,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store
      .select('listPage')
      .select('iterations')
      .subscribe((iterations: IterationModel[]) => {
        if (iterations.length) {
          this.manipulateData(iterations);
        }
      })
  }

  manipulateData(iterations: IterationModel[]) {
    const rootIteration: IterationModel = iterations.find(i => {
      return i.attributes['parent_path'] == '/';
    });
    if (rootIteration) {
      this.numberOfItemsInBacklog =
      rootIteration.relationships.workitems.meta.total;
    }
  }

  setGuidedTypeWI() {

  }
}
