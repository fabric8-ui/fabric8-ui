import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DropdownComponent } from './../../shared-component/dropdown/dropdown.component';
import { DropdownOption } from './../../shared-component/dropdown/dropdown-option';
import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';
import { Dialog } from '../../shared-component/dialog/dialog';
import { DialogComponent } from '../../shared-component/dialog/dialog.component';

@Component({  
  selector: 'work-item-list',
  templateUrl: './work-item-list.component.html',
  styleUrls: ['./work-item-list.component.scss'],
})
export class WorkItemListComponent implements OnInit {
  workItems: WorkItem[];
  selectedWorkItem: WorkItem;  
  addingWorkItem = false;
  dialog: Dialog;
  showDialog = false;

  stateDropdownOptions: DropdownOption[];

  constructor(
    private router: Router,
    private workItemService: WorkItemService,
    private logger: Logger) {

  }

  ngOnInit(): void {
    this.getOptions();
    this.getWorkItems();
  }

  getOptions(): void {
      this.workItemService.getStatusOptions()
      .then((options) => {
        this.stateDropdownOptions = options;
      })
  }

  getWorkItems(): void {
    this.workItemService
      .getWorkItems()
      .then((wItems) => {
        return wItems.reverse();
      })
      .then((wItems) => {
        this.workItemService
        .getStatusOptions()
        .then((options) => {
          this.workItems = wItems.map((item) => {
            item.selectedState = this.workItemService.getSelectedState(item, options);
            return item;
          });
        });
      });
  }

  addWorkItem(): void {
    this.addingWorkItem = true;
    this.selectedWorkItem = null;
  }

  close(savedWorkItem: WorkItem) {
    this.addingWorkItem = false;
    if (savedWorkItem) { this.getWorkItems(); }
  }

  onStateUpdate(val: any) {
    let index = this.workItems.findIndex((item) => {
      return item.id == val.currentOption.extra_params.workItem_id;
    });
    this.workItems[index].fields["system.state"] = val.newOption.option;
    this.workItems[index].statusCode = val.newOption.id;
    this.workItemService
      .update(this.workItems[index])
      .then((updatedWorkItem) => {
        this.workItemService
        .getStatusOptions()
        .then((options) => {
          updatedWorkItem.selectedState = this.workItemService.getSelectedState(updatedWorkItem, options);
          this.workItems[index] = updatedWorkItem;
        });
      });
  }

  confirmDelete(workItem: WorkItem){
    this.selectedWorkItem = workItem;
    this.dialog = {
      "title":"Confirm deletetion of Work Item",
      "message":"Are you sure you want to delete Work Item - " + workItem.fields["system.title"] + " ?",
      "actionButtons" : [
        {'title':"Delete","value":1},
        {'title':"Don't Delete","value":0}]
    };
    this.showDialog = true;    
  }
  
  deleteWorkItem(workItem: WorkItem): void {
    this.workItemService
      .delete(workItem)
      .then(() => {
        this.workItems = this.workItems.filter(h => h !== workItem);
        if (this.selectedWorkItem === workItem) { this.selectedWorkItem = null; }
      });
  }

  onSelect(workItem: WorkItem): void {
    this.selectedWorkItem = workItem;
  }

  gotoDetail(workItem: WorkItem): void {
    this.selectedWorkItem = workItem;
    this.router.navigate(['/detail', this.selectedWorkItem.id]);
  }
  
  onButtonClick(val: number) {
    console.log(val)    
    if(val==1){
      this.deleteWorkItem(this.selectedWorkItem);
    }else{      
    }
    this.showDialog = false
  }
}
