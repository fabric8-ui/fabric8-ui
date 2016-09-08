import { Location }               from '@angular/common';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AlmTrim } from '../../pipes/alm-trim';
import { AuthenticationService } from './../../auth/authentication.service';

import { Logger } from '../../shared/logger.service';

import { Dialog } from '../../shared-component/dialog/dialog';
import { DialogComponent } from '../../shared-component/dialog/dialog.component';

import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'alm-work-item-detail',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.scss']
})

export class WorkItemDetailComponent implements OnInit {  
  workItem: WorkItem;

  // TODO: These should be read from the WorkitemTypeService
  workItemTypes = ['system.experience', 'system.feature', 'system.userstory', 'system.bug', 'system.fundamental', 'system.valueproposition'];
  // TODO: These should be read from the WorkitemType of the given Workitem
  workItemStates = ['new', 'in progress', 'resolved', 'closed'];

  dialog: Dialog = {
    'title' : 'Changes have been made',
    'message' : 'Do you want to discard your changes?',
    'actionButtons': [
        {'title': ' Discard', 'value': 1},
        {'title': 'Cancel', 'value': 0}]
  };
  showDialog: boolean = false;
  
  submitted = false;
  active = true;
  loggedIn: Boolean = false;
  
  constructor(
    private auth: AuthenticationService,
    private workItemService: WorkItemService,
    private route: ActivatedRoute,
    private location: Location,
    private logger: Logger
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.workItemService.getWorkItem(id)
          .then(workItem => this.workItem = workItem);
      } else {
        this.workItem = new WorkItem();
        this.workItem.fields = {'system.assignee': null, 'system.state': 'new', 'system.creator': 'me', 'system.title': null, 'system.description': null};
        this.workItem.type = 'system.userstory';
      }
    });
    this.loggedIn = this.auth.isLoggedIn();
  }

  save(): void {
    //this.workItem.fields['system.title'] = this.workItem.fields['system.title'].trim();
    if (this.workItem.fields['system.title']) {
      this.workItemService
      .update(this.workItem)
      .then(() => 
        this.goBack(false));
    } 
  }

  goBack(change: boolean): void {
    if (change == true){
      this.showDialog = true;
    }else{
      this.location.back();
    }    
  }

  onButtonClick(val: number): void{
    if (val == 1){
      this.goBack(false);
    }else{
      this.showDialog = false;
    }
  }
}



