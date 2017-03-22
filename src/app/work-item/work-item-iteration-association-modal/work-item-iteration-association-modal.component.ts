import { Component, ViewChild, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
} from 'ngx-login-client';

import { WorkItem }          from '../../models/work-item';
import { WorkItemService }   from '../work-item.service';
import { IterationModel }    from '../../models/iteration.model';
import { IterationService }  from '../../iteration/iteration.service';


@Component({
  selector: 'fab-planner-associate-iteration-modal',
  templateUrl: './work-item-iteration-association-modal.component.html',
  styleUrls: ['./work-item-iteration-association-modal.component.scss']
})
export class FabPlannerAssociateIterationModalComponent implements OnInit, OnChanges {

  @Input() workItem: WorkItem;
  @ViewChild('dropdownButton') dropdownButton: any;
  @ViewChild('commitAssociation') commitAssociation: any;
  @ViewChild('iterationAssociationModal') iterationAssociationModal: any;

  iterations: IterationModel[];
  selectedIteration: IterationModel;

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private logger: Logger,
    private iterationService: IterationService,
  ) {}

  ngOnInit() {
    this.iterations = this.iterationService.iterations;
  }

  ngOnChanges() {

  }

  onChangeIteration(iteration: IterationModel): void {
    // Cache changed iteration
    this.selectedIteration = iteration;

    // Update dropdown button content
    this.dropdownButton.nativeElement.innerHTML = this.selectedIteration.attributes.name + ' <span class="caret"></span>';

    // Enable/disable confirmation button if iteration was changed
    if (!!this.workItem.relationalData.iteration &&
        this.workItem.relationalData.iteration.id === this.selectedIteration.id) {
      this.commitAssociation.nativeElement.setAttribute("disabled", "true");
    } else {
      this.commitAssociation.nativeElement.removeAttribute("disabled");
    }
  }

  assignIteration(event: MouseEvent): void {
    // Send out an iteration change event
    let currenIterationID = this.workItem.relationships.iteration.data ?
      this.workItem.relationships.iteration.data.id : 0;
    this.broadcaster.broadcast('associate_iteration', {
      workItemId: this.workItem.id,
      currentIterationId: currenIterationID,
      futureIterationId: this.selectedIteration.id
    });

    // If already closed iteration
    if (this.workItem.attributes['system.state'] === 'closed') {
      this.broadcaster.broadcast('wi_change_state', [{
        iterationId: currenIterationID,
        closedItem: -1
      }, {
        iterationId: this.selectedIteration.id,
        closedItem: +1
      }]);
    }

    this.workItem.relationships.iteration = {
      data: {
        id: this.selectedIteration.id,
        type: 'iteration'
      }
    };
    this.save();
    this.selectedIteration = null;
    this.iterationAssociationModal.close();
    this.commitAssociation.nativeElement.setAttribute("disabled", "true");
  }

  save(): void {
    this.workItemService
      .update(this.workItem)
      .then((workItem) => {
        this.selectedIteration = null;
      });
  }

  open() {
    this.iterationAssociationModal.open();
  }
}
