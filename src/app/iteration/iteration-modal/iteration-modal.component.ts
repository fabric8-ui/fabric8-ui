import { Component, ViewChild, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { Broadcaster } from 'ngx-login-client';
import { Space } from 'ngx-fabric8-wit';

import { IterationService } from '../iteration.service';
import { IterationModel } from '../../models/iteration.model';


@Component({
  selector: 'fab-planner-iteration-modal',
  templateUrl: './iteration-modal.component.html',
  styleUrls: ['./iteration-modal.component.scss']
})
export class FabPlannerIterationModalComponent implements OnInit, OnDestroy, OnChanges {

  private spaceSubscription: Subscription = null;

  @Output()
  public onSubmit = new EventEmitter();

  @ViewChild('createUpdateIterationDialog') createUpdateIterationDialog: any;
  public iteration: IterationModel;
  private validationError = false;
  private modalType: string = 'create';
  private submitBtnTxt: string = 'Create';
  private modalTitle: string = 'Create Iteration';
  private startDate: any;
  private endDate: any;
  private spaceError: Boolean = false;
  private spaceName: string = 'FIXME';
  private iterationName: string;

  private startDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: false
  };

  private endDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: false
  };

  constructor(
    private iterationService: IterationService,
    private broadcaster: Broadcaster) {}


  ngOnInit() {
    this.resetValues();
    this.spaceSubscription = this.broadcaster.on<Space>('spaceChanged').subscribe(space =>  {
      if (space) {
        console.log('[FabPlannerIterationModalComponent] New Space selected: ' + space.attributes.name);
      } else {
        console.log('[FabPlannerIterationModalComponent] Space deselected.');
      }
    });
  }

  resetValues() {

    this.iteration  = {
      // id: '',
      attributes: {
        name: '',
        description: '',
        state: 'new'
      },
      relationships: {
        space: {
          data: {
            id: '',
            type: 'space'
          },
          links: {
            self: ''
          }
        }
      },
      type: 'iterations'
    } as IterationModel;

    let today = moment();
    this.startDate = { date: { year: today.format('YYYY'), month: today.format('M'), day: today.format('D') } };
    let inaweek = moment().add(7, 'd');
    this.endDate = { date: { year: inaweek.format('YYYY'), month: inaweek.format('M'), day: inaweek.format('D') } };
    this.validationError = false;
    this.spaceError = false;
    let startDatePickerComponentCopy = Object.assign({}, this.startDatePickerOptions);
    startDatePickerComponentCopy.componentDisabled = false;
    this.startDatePickerOptions = startDatePickerComponentCopy;
  }

  ngOnChanges() {
    console.log(this.modalType);
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  openCreateUpdateModal(
    type: string = 'create',
    iteration: IterationModel | null = null
  ) {
    this.modalType = type;
    if (this.modalType == 'create') {
      this.submitBtnTxt = 'Create';
      this.modalTitle = 'Create Iteration';
    }
    if (this.modalType == 'start') {
      this.submitBtnTxt = 'Start';
      this.modalTitle = 'Start Iteration';
    }
    if (this.modalType == 'update') {
      this.submitBtnTxt = 'Update';
      this.modalTitle = 'Update Iteration';
      if (iteration.attributes.state === 'start') {
        let startDatePickerComponentCopy = Object.assign({}, this.startDatePickerOptions);
        startDatePickerComponentCopy.componentDisabled = true;
        this.startDatePickerOptions = startDatePickerComponentCopy;
      }
    }
    if (this.modalType == 'close') {
      this.submitBtnTxt = 'Close';
      this.modalTitle = 'Close Iteration';
    }
    if (iteration) {
      this.iteration = cloneDeep(iteration);
      if (this.iteration.attributes.startAt) {
        let startDate = moment(this.iteration.attributes.startAt);
        this.startDate = { date: { year: startDate.format('YYYY'), month: startDate.format('M'), day: startDate.format('D') } };
      }
      if (this.iteration.attributes.endAt) {
        let endDate = moment(this.iteration.attributes.endAt);
        this.endDate = { date: { year: endDate.format('YYYY'), month: endDate.format('M'), day: endDate.format('D') } };
      }
    }

    this.createUpdateIterationDialog.open();
  }

  actionOnOpen() {
    // console.log('Open');
  }

  actionOnClose() {
    //console.log('Close');
    this.resetValues();
  }

  onStartDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    // Format 2016-11-29T23:18:14Z
    this.startDate = { date: event.date };
    this.iteration.attributes.startAt = moment(event.jsdate).format('YYYY-MM-DD') + 'T00:00:00Z';
    // console.log(this.iteration.attributes.startAt);

    let endDatePickerComponentCopy = Object.assign({}, this.endDatePickerOptions);
    endDatePickerComponentCopy['disableUntil'] = event.date;
    this.endDatePickerOptions = endDatePickerComponentCopy;

    // Set default end date in a week
    let inaweek = moment(event.jsdate).add(7, 'd');
    this.endDate = { date: { year: inaweek.format('YYYY'), month: inaweek.format('M'), day: inaweek.format('D') } };
  }

  onEndDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    this.endDate = { date: event.date };
    this.iteration.attributes.endAt = moment(event.jsdate).format('YYYY-MM-DD') + 'T00:00:00Z';
    // console.log(this.iteration.attributes.endAt);
  }

  actionOnSubmit() {
    this.iteration.attributes.name = this.iteration.attributes.name.trim();
    if (this.iteration.attributes.name !== '') {
      this.validationError = false;
      if (this.modalType == 'create') {
        this.iterationService.createIteration(this.iteration)
          .then((iteration) => {
            this.onSubmit.emit(iteration);
            this.resetValues();
            this.createUpdateIterationDialog.close();
          })
          .catch ((e) => {
            this.validationError = true;
            console.log('Some error has occured', e);
          });
      } else {
        if (this.modalType == 'start') {
          this.iteration.attributes.state = 'start';
        } else if (this.modalType == 'close') {
          this.iteration.attributes.state = 'close';
        } else {
          // Not include state if it's just an update
          delete this.iteration.attributes.state;
        }
        this.iterationService.updateIteration(this.iteration)
          .then((iteration) => {
            this.onSubmit.emit(iteration);
            if (this.modalType == 'start') {
              let toastIterationName = this.iteration.attributes.name;
              if (toastIterationName.length > 15) {
                toastIterationName = toastIterationName.slice(0, 15) + '...';
              }
              let notificationData = {
                'notificationText': `<strong>${toastIterationName}</strong> &nbsp; has started.`,
                'notificationType': 'ok'
              };
              this.broadcaster.broadcast('toastNotification', notificationData);
              this.iterationName = this.iteration.attributes.name;
            }
            this.resetValues();
            this.createUpdateIterationDialog.close();
          })
          .catch ((e) => {
            this.spaceError = true;
            // this.resetValues();
            // console.log('Some error has occured', e.toString());
          });
        }
      } else {
        this.validationError = true;
      }
    }

    removeError() {
      this.validationError = false;
    }
}
