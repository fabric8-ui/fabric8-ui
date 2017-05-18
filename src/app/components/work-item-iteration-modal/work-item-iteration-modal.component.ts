import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
} from 'ngx-login-client';

import { WorkItem }          from '../../models/work-item';
import { WorkItemService }   from '../../services/work-item.service';
import { IterationModel }    from '../../models/iteration.model';
import { IterationService }  from '../../services/iteration.service';


@Component({
  selector: 'fab-planner-associate-iteration-modal',
  templateUrl: './work-item-iteration-modal.component.html',
  styleUrls: ['./work-item-iteration-modal.component.scss']
})
export class FabPlannerAssociateIterationModalComponent {

  @Input() workItem: WorkItem;
  @ViewChild('dropdownButton') dropdownButton: any;
  @ViewChild('commitAssociation') commitAssociation: any;
  @ViewChild('iterationAssociationModal') iterationAssociationModal: any;
  @ViewChild('iterationList') iterationList: any;
  @ViewChild('iterationSearch') iterationSearch: any;

  iterations: IterationModel[];
  selectedIteration: IterationModel;
  showIterationDropdown: Boolean = false;
  iterationsValue: any = [];
  filteredIterations: any = [];
  selectedIterationName: any = '';
  enableAssociateButton: Boolean = false;
  modalTitle: string = "Associate with Iteration";

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private logger: Logger,
    private iterationService: IterationService,
  ) {}

  getIterations() {
    this.iterationService.getIterations()
      .subscribe((iterations: IterationModel[]) => {
        this.iterations = iterations;
        for (let i=0; i<iterations.length; i++) {
          this.iterationsValue.push({
            key: iterations[i].id,
            value: (iterations[i].attributes.resolved_parent_path + '/' + iterations[i].attributes.name).replace('//', '/')
          });
        };
      });
  }

  resetValues() {
    this.filteredIterations = [];
    this.iterationsValue = [];
    this.enableAssociateButton = false;
    this.showIterationDropdown = false;
  }

  filterIteration(event:any) {
    event.stopPropagation();
    this.showIterationDropdown = true;
    // Down arrow or up arrow
    if (event.keyCode == 40 || event.keyCode == 38) {
      let lis = this.iterationList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i == lis.length) { // No existing selected
        if (event.keyCode == 40) { // Down arrow
          lis[0].classList.add('selected');
          // this.setParentIteration(lis[0].getAttribute('data-id'));
          lis[0].scrollIntoView(false);
        } else { // Up arrow
          lis[lis.length - 1].classList.add('selected');
          // this.setParentIteration(lis[lis.length - 1].getAttribute('data-id'));
          lis[lis.length - 1].scrollIntoView(false);
        }
      } else { // Existing selected
        lis[i].classList.remove('selected');
        if (event.keyCode == 40) { // Down arrow
          lis[(i + 1) % lis.length].classList.add('selected');
          // this.setParentIteration(lis[(i + 1) % lis.length].getAttribute('data-id'));
          lis[(i + 1) % lis.length].scrollIntoView(false);
        } else { // Down arrow
          // In javascript mod gives exact mod for negative value
          // For example, -1 % 6 = -1 but I need, -1 % 6 = 5
          // To get the round positive value I am adding the divisor
          // with the negative dividend
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].classList.add('selected');
          // this.setParentIteration(lis[(((i - 1) % lis.length) + lis.length) % lis.length].getAttribute('data-id'));
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].scrollIntoView(false);
        }
      }
    } else if (event.keyCode == 13) { // Enter key event
      let lis = this.iterationList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i < lis.length) {
        if (lis[i].getAttribute('data-id') !== null) {
          let item = this.iterationsValue.find((iteration) => iteration.key === lis[i].getAttribute('data-id'));
          this.associateIteration(item);
        } else {
          this.showIterationDropdown = false;
        }
      }
    } else {
      let inp = this.iterationSearch.nativeElement.value.trim();
      this.filteredIterations = this.iterationsValue.filter((item) => {
         return item.value.toLowerCase().indexOf(inp.toLowerCase()) > -1;
      });
      if (this.filteredIterations.length == 0) {
        this.selectedIteration = null;
        this.enableAssociateButton = false;
      }
    }
  }

  iterationSearchFocus() {
    if (this.showIterationDropdown) {
      this.showIterationDropdown = false;
    } else {
      this.filteredIterations = this.iterationsValue;
      this.showIterationDropdown = true;
    }
  }

  associateIteration(value: any) {
    this.selectedIteration =  this.iterations.find((iteration) => iteration.id === value.key);
    this.selectedIterationName = value.value;
    this.iterationSearch.nativeElement.focus();
    if (this.selectedIteration) {
      this.enableAssociateButton = true;
    }
    this.showIterationDropdown = false;
  }

  assignIteration(event: MouseEvent): void {
    // Send out an iteration change event
    let currentIterationID = this.workItem.relationships.iteration.data ?
      this.workItem.relationships.iteration.data.id : 0;
    this.broadcaster.broadcast('associate_iteration', {
      workItemId: this.workItem.id,
      currentIterationId: currentIterationID,
      futureIterationId: this.selectedIteration.id
    });

    // If already closed iteration
    if (this.workItem.attributes['system.state'] === 'closed') {
      this.broadcaster.broadcast('wi_change_state', [{
        iterationId: currentIterationID,
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
    this.enableAssociateButton = false;
  }

  save(): void {
    this.workItemService
      .update(this.workItem)
      .switchMap(item => {
        return this.iterationService.getIteration(item.relationships.iteration)
          .map(iteration => {
            item.relationships.iteration.data = iteration;
            return item;
          });
      })
      .subscribe((workItem) => {
        this.selectedIteration = null;
        this.workItem = workItem;
      });
  }

  open(event: any) {
    event.stopPropagation();
    this.getIterations();
    this.iterationAssociationModal.open();
  }

  actionOnOpen() {
    if (this.workItem.relationships.iteration) {
      this.selectedIterationName = (this.workItem.relationships.iteration.data.attributes.resolved_parent_path +
        '/' +
        this.workItem.relationships.iteration.data.attributes.name).replace('//', '/');
    }
  }

  actionOnClose() {
    // console.log('Close');
    this.resetValues();
  }
}
