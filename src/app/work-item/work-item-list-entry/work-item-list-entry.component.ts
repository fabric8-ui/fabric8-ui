import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router }                                         from '@angular/router';

import { Logger } from '../../shared/logger.service';

import { Dialog }            from '../../shared-component/dialog/dialog';
import { DialogComponent }   from '../../shared-component/dialog/dialog.component';
import { DropdownOption }    from '../../shared-component/dropdown/dropdown-option';
import { DropdownComponent } from '../../shared-component/dropdown/dropdown.component';

import { WorkItem }        from '../../work-item/work-item';
import { WorkItemService } from '../../work-item/work-item.service';

/**
 * Work Item List Entry Component - Displays a work item and action elements for it.
 *
 * Inputs: workItem:WorkItem - the WorkItem to be displayed.
 * Events: selectEvent(WorkItemListEntryComponent) - Entry is selected.
 * detailEvent(WorkItemListEntryComponent) - Detail view for entry is requested.
 * deleteEvent(WorkItemListEntryComponent) - Signals deletion (see note below!).
 *
 * Note: all navigational events are delegated to a parent component:
 * detailEvent, selectEvent. The parent component has the obligation to manually call
 * select() on this component! Why? Because this allows the parent component to customize
 * the select behaviour (like multi-selects or xor selects).
 *
 * All data events (deleteEvent only currently) are done inside this component (the service
 * is called to delete the workItem) and an event is delegated back to the parent for
 * information purposes. The parent MUST NOT delete the workItem associated. The event is
 * intended for display purposes, like removing the entry element and reloading the list.
 */

@Component({
  selector: 'alm-work-item-list-entry',
  templateUrl: '/work-item-list-entry.component.html',
  styleUrls: ['/work-item-list-entry.component.scss'],
})
export class WorkItemListEntryComponent implements OnInit {

  @Input() workItem: WorkItem;
  @Output() selectEvent: EventEmitter<WorkItemListEntryComponent> = new EventEmitter<WorkItemListEntryComponent>();
  @Output() detailEvent: EventEmitter<WorkItemListEntryComponent> = new EventEmitter<WorkItemListEntryComponent>();
  @Output() deleteEvent: EventEmitter<WorkItemListEntryComponent> = new EventEmitter<WorkItemListEntryComponent>();

  stateDropdownOptions: DropdownOption[];
  selected: boolean = false;
  actionDropdownOpen: boolean = false;
  dialog: Dialog;
  showDialog = false;

  constructor(private router: Router,
              private workItemService: WorkItemService,
              private logger: Logger) {
  }

  ngOnInit(): void {
    this.getOptions();
  }

  getOptions(): void {
    this.workItemService.getStatusOptions()
      .then((options) => {
        this.stateDropdownOptions = options;
      });
  }

  getWorkItem(): WorkItem {
    return this.workItem;
  }

  select(): void {
    event.stopPropagation();
    this.selected = true;
  }

  deselect(): void {
    this.actionDropdownOpen = false;
    this.selected = false;
  }

  isSelected(): boolean {
    return this.selected;
  }

  // helpers

  confirmDelete(event: MouseEvent) {
    event.stopPropagation();
    this.dialog = {
      'title': 'Confirm deletion of Work Item',
      'message': 'Are you sure you want to delete Work Item - ' + this.workItem.fields['system.title'] + ' ?',
      'actionButtons': [
        {'title': 'Confirm', 'value': 1},
        {'title': 'Cancel', 'value': 0}]
    };
    this.showDialog = true;
  }

  onButtonClick(val: number) {
    // callback from the confirm delete dialog 
    if (val == 1) {
      this.onDelete(null);
    }
    this.showDialog = false;
  }

  // event handlers

  onToggleActionDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.actionDropdownOpen = !this.actionDropdownOpen;
    // clicking on the action menu automatically selects the entry
    this.selectEvent.emit(this);
  }

  onDelete(event: MouseEvent): void {
    if (event)
      event.stopPropagation();
    this.workItemService
      .delete(this.workItem)
      .then(() => {
        this.deleteEvent.emit(this);
      });
  }

  onSelect(event: MouseEvent): void {
    event.stopPropagation();
    this.selectEvent.emit(this);
  }

  onDetail(event: MouseEvent): void {
    event.stopPropagation();
    this.detailEvent.emit(this);
  }

  onMoveToBacklog(event: MouseEvent): void {
    alert('NOT IMPLEMENTED YET.');
  }

  onChangeState(val: any): void {
    this.getWorkItem().fields['system.state'] = val.newOption.option;
    this.getWorkItem().statusCode = val.newOption.id;
    this.workItemService
      .update(this.getWorkItem())
      .then((updatedWorkItem) => {
        this.workItemService
          .getStatusOptions()
          .then((options) => {
            updatedWorkItem.selectedState = this.workItemService.getSelectedState(updatedWorkItem, options);
          });
      });
  }
}