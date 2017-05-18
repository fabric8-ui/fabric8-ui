import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Subscription } from 'rxjs/Subscription';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { WorkItemService } from '../../../services/work-item.service';
import { WorkItemListEntryComponent } from '../../work-item-list-entry/work-item-list-entry.component';
import { WorkItemType } from '../../../models/work-item-type';
import { WorkItem } from '../../../models/work-item';

import {
  AlmArrayFilter
} from 'ngx-widgets';

@Component({
  selector: 'create-selector-widget',
  templateUrl: './work-item-create-selector.component.html',
  styleUrls: ['./work-item-create-selector.component.scss']
})
export class WorkItemDetailAddTypeSelectorWidgetComponent implements OnInit {

  @Input() workItemTypes: WorkItemType[] = [];
  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onClose') onClose = new EventEmitter();

  panelState: string = 'out';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces) {
  }

  ngOnInit() {
  }

  close() {
    this.onClose.emit();
    this.panelState = 'out';
  }

  open() {
    this.panelState = 'in';
  }

  select(type: WorkItemType) {
    this.onSelect.emit(type);
    this.panelState = 'out';
  }
}
