import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';
import { removeAction } from '../../../app-routing.module';


// TODO HACK
import { WorkItemService } from 'fabric8-planner/src/app/work-item/work-item.service';
import { WorkItemType } from 'fabric8-planner/src/app/models/work-item-type';
import { WorkItemDetailAddTypeSelectorWidgetComponent } from 'fabric8-planner/src/app/work-item/work-item-detail-add-type-selector/work-item-detail-add-type-selector-widget/work-item-detail-add-type-selector-widget.component';

@Component({
  selector: 'fabric8-create-work-item-overlay',
  templateUrl: './create-work-item-overlay.component.html',
  styleUrls: ['./create-work-item-overlay.component.scss']
})
export class CreateWorkItemOverlayComponent implements OnInit, AfterViewInit {

  workItemTypes: Observable<any[]>;
  space: Space;

  @ViewChild('detailAddTypeSelector') overlay: WorkItemDetailAddTypeSelectorWidgetComponent;

  constructor(
    private router: Router,
    private spaces: Spaces,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService
  ) { }

  ngOnInit() {
    this.spaces.current.subscribe(space => this.space = space);
    this.workItemTypes = this.workItemService.getWorkItemTypes();
  }

  ngAfterViewInit() {
    this.overlay.open();
  }

  onClose() {
    this.router.navigateByUrl(removeAction(this.router.url));
  }

  onSelect(workItemType: WorkItemType) {
    this.router
      .navigateByUrl(`/${this.space.relationalData.creator.attributes.username}/${this.space.attributes.name}/plan/detail/new?type=${workItemType.id}`);
  }

}
