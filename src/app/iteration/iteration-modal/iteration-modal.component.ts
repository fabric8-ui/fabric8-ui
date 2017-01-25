import { IterationService } from './../iteration.service';
import { IterationModel } from './../../models/iteration.model';
import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'fab-planner-iteration-modal',
  templateUrl: './iteration-modal.component.html',
  styleUrls: ['./iteration-modal.component.scss']
})
export class FabPlannerIterationModalComponent implements OnInit {
  @Output()
  public onCreateSuccess = new EventEmitter();

  @ViewChild('createUpdateIterationDialog') createUpdateIterationDialog: any;
  public iteration: IterationModel = {
    attributes: {
      name: ""
    },
    relationships: {
      space: {
        data: {
          id: "",
        }
      }
    },
    type: "iterations"
  } as IterationModel;
  private validationError = false;

  constructor(
    private iterationService: IterationService) {}

  ngOnInit() {

  }

  openCreateUpdateModal() {
    this.createUpdateIterationDialog.open();
  }

  actionOnOpen() {
    // console.log('Open');
  }

  actionOnClose() {
    // console.log('Close');
    this.resetValues();
  }

  resetValues() {
    this.iteration.attributes.endAt = "";
    this.iteration.attributes.startAt = "";
    this.iteration.attributes.name = "";
    this.iteration.relationships.space.data.id = "";
    this.validationError = false;
  }

  actionOnSubmit() {
    if (this.iteration.attributes.name.trim() !== "") {
      this.validationError = false;
      this.iterationService.getSpaces()
        .then((data) => {
          let url = data.relationships.iterations.links.related;
          this.iteration.relationships.space.data.id = data.id;
          this.iterationService.createIteration(url, this.iteration)
          .then((iteration) => {
            this.onCreateSuccess.emit(iteration);
            this.createUpdateIterationDialog.close();
          })
          .catch ((e) => {
            console.log('Some error has occured', e);
          })
        })
        .catch ((err) => {
          console.log('Spcae not found');
        });
      } else {
        this.validationError = true;
      }
    }
}
