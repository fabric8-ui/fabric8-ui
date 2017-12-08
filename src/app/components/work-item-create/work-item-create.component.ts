import { Subscription } from 'rxjs/Subscription';
import { cloneDeep, trimEnd } from 'lodash';

import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { AlmArrayFilter } from 'ngx-widgets';
import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { WorkItemDetailAddTypeSelectorWidgetComponent } from './work-item-create-selector/work-item-create-selector.component';
import { WorkItemService } from '../../services/work-item.service';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItem } from '../../models/work-item';

@Component({
  selector: 'detail-add-type-selector',
  templateUrl: './work-item-create.component.html',
  styleUrls: ['./work-item-create.component.less']
})
export class WorkItemDetailAddTypeSelectorComponent implements OnInit, OnChanges {

  @Input() wiTypes: WorkItemType[] = [];
  @Input() takeFromInput: boolean = false;

  @ViewChild('detailAddTypeSelector') workItemDetailAddTypeSelectorWidget: WorkItemDetailAddTypeSelectorWidgetComponent;

  loggedIn: boolean = false;
  workItemTypes: WorkItemType[] = [];
  spaceSubscription: Subscription = null;
  selectedIterationId: string;
  selectedAreaId: string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces) {
  }

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[WorkItemDetailAddTypeSelectorComponent] New Space selected: ' + space.attributes.name);
        this.getWorkItemTypes();
      } else {
        console.log('[WorkItemDetailAddTypeSelectorComponent] Space deselected.');
        this.workItemTypes = [];
      }
    });
  }

  ngOnChanges() {
    if (this.takeFromInput) {
      this.workItemTypes = this.wiTypes;
    }
  }

  //Detailed add functions
  getWorkItemTypes() {
    if (this.takeFromInput) {
      this.workItemTypes = this.wiTypes;
    } else {
      this.workItemService.getWorkItemTypes()
        .subscribe((types) => {
          this.workItemTypes = types;
        });
    }
  }

  closePanel() {
    this.workItemDetailAddTypeSelectorWidget.close();
  }

  // optional, we can supply context area and iteration that is
  // appended to the next url to be consumed by the create dialog
  // for pre-selecting values.
  openPanel(iterationId?: string, areaId?: string) {
    this.selectedIterationId = iterationId;
    this.selectedAreaId = areaId;
    this.workItemDetailAddTypeSelectorWidget.open();
  }

  onChangeType(type: WorkItemType) {
    this.workItemDetailAddTypeSelectorWidget.close();
    this.router.navigateByUrl(
      trimEnd(
        this.router.url.split('plan')[0], '/')
        + '/plan/detail/new?type='
        + type.id
        + (this.selectedIterationId?'&iteration='+this.selectedIterationId:'')
        + (this.selectedAreaId?'&area='+this.selectedAreaId:'')
      );
  }
}
