import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  OnChanges,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Subscription } from 'rxjs/Subscription';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { WorkItemService } from '../../../services/work-item.service';
import { WorkItemType } from '../../../models/work-item-type';
import { WorkItem } from '../../../models/work-item';

import {
  AlmArrayFilter
} from 'ngx-widgets';

@Component({
  selector: 'create-selector-widget',
  templateUrl: './work-item-create-selector.component.html',
  styleUrls: ['./work-item-create-selector.component.less']
})
export class WorkItemDetailAddTypeSelectorWidgetComponent implements OnInit, AfterViewChecked{

  @Input() workItemTypes: WorkItemType[] = [];
  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onClose') onClose = new EventEmitter();
  @ViewChild('modalPosition') modalPosition: ElementRef;

  panelState: string = 'out';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces,
    private renderer: Renderer2 ) {
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    if(this.modalPosition) {
      let hdrHeight:number = 0;
      if(document.getElementsByClassName('navbar-pf').length > 0) {
        hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
      }
      this.renderer.setStyle(this.modalPosition.nativeElement, 'top', hdrHeight + "px");
    }
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
