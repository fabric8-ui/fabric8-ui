import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'fab-planner-iteration-modal',
  templateUrl: './iteration-modal.component.html',
  styleUrls: ['./iteration-modal.component.scss']
})
export class FabPlannerIterationModalComponent {
  @ViewChild('createUpdateIterationDialog') createUpdateIterationDialog: any;

  openCreateUpdateModal() {
    this.createUpdateIterationDialog.open()
  }
}
