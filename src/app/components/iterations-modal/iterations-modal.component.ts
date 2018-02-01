import {
  Component,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  ElementRef
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { Broadcaster } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { IterationService } from '../../services/iteration.service';
import { IterationModel } from '../../models/iteration.model';


@Component({
  selector: 'fab-planner-iteration-modal',
  templateUrl: './iterations-modal.component.html',
  styleUrls: ['./iterations-modal.component.less']
})
export class FabPlannerIterationModalComponent implements OnInit, OnDestroy, OnChanges {

  private spaceSubscription: Subscription = null;

  @Output()
  public onSubmit = new EventEmitter();

  @ViewChild('createUpdateIterationDialog') createUpdateIterationDialog: any;
  @ViewChild('iterationSearch') iterationSearch: any;
  @ViewChild('iterationList') iterationList: any;
  @ViewChild('itrname') itrname: ElementRef;
  
  public iteration: IterationModel;
  private validationError = false;
  private modalType: string = 'create';
  private submitBtnTxt: string = 'Create';
  private modalTitle: string = 'Create Iteration';
  private startDate: any;
  private endDate: any;
  private spaceError: Boolean = false;
  private iterationName: string;
  iterations: IterationModel[] = [];
  iterationsValue: any = [];
  filteredIterations: any = [];
  selectedParentIteration: IterationModel;
  selectedParentIterationName:string = '';
  iterationSearchDisable: Boolean = false;
  showIterationDropdown: Boolean = false;
  validationString: string = 'Something went wrong.'

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
    private spaces: Spaces,
    private broadcaster: Broadcaster) {}


  ngOnInit() {
    this.resetValues();
    this.spaceSubscription = this.spaces.current.subscribe(space =>  {
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
        user_active: false,
        name: '',
        description: '',
        state: 'new',
        parent_path: '',
        resolved_parent_path: ''
      },
      relationships: {
        parent: {
          data: {
            id: "",
            type: "iterations"
          },
          links: {
            self: ""
          }
        },
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

    let endDatePickerComponentCopy = Object.assign({}, this.endDatePickerOptions);
    let startDatePickerComponentCopy = Object.assign({}, this.startDatePickerOptions);
    let aDayBefore = moment().subtract(1, 'days');
    let aDayBeforeDate = { date: { year: aDayBefore.format('YYYY'), month: aDayBefore.format('M'), day: aDayBefore.format('D') }} as any;
    endDatePickerComponentCopy['disableUntil'] = aDayBeforeDate.date;
    startDatePickerComponentCopy['componentDisabled'] = false;
    startDatePickerComponentCopy['disableSince'] = {year: 0, month: 0, day: 0};
    this.startDatePickerOptions = startDatePickerComponentCopy;
    this.endDatePickerOptions = endDatePickerComponentCopy;
    this.validationError = false;
    this.spaceError = false;
    this.selectedParentIterationName = '';
    this.filteredIterations = [];
    this.selectedParentIteration = null;
    this.iterationSearchDisable = false;
    this.showIterationDropdown = false;
    this.iterations = [];
    this.iterationsValue = [];
    this.startDate = '';
    this.endDate = '';
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  openCreateUpdateModal(
    type: string = 'create',
    iteration: IterationModel | null = null,
    e?: any
  ) {
    if(e) {
      e.stopPropagation();
    }

    this.modalType = type;
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
    if (this.modalType == 'create') {
      this.getIterations();
      this.submitBtnTxt = 'Create';
      this.modalTitle = 'Create Iteration';
      if (this.iterationSearch)
        this.iterationSearch.nativeElement.setAttribute('placeholder', 'None');
      this.startDate = '';
      this.endDate = '';
    }
    if (this.modalType == 'start') {
      this.submitBtnTxt = 'Start';
      this.modalTitle = 'Start Iteration';
    }
    if (this.modalType == 'update') {
      this.getIterations();
      this.submitBtnTxt = 'Update';
      this.modalTitle = 'Update Iteration';
      this.iterationSearchDisable = true;
      this.selectedParentIterationName = iteration.attributes.resolved_parent_path;

      if (iteration.attributes.state === 'start') {
        let startDatePickerComponentCopy = Object.assign({}, this.startDatePickerOptions);
        startDatePickerComponentCopy['componentDisabled'] = true;
        this.startDatePickerOptions = startDatePickerComponentCopy;
      }
    }
    if (this.modalType == 'createChild') {
      this.getIterations();
      this.submitBtnTxt = 'Create';
      this.modalTitle = 'Create Iteration';
      this.selectedParentIterationName = (iteration.attributes.resolved_parent_path+'/'+iteration.attributes.name).replace("//", "/");
      this.selectedParentIteration = iteration;
      this.iteration.attributes.name = '';
      this.startDate = '';
      this.endDate = '';
    }
    if (this.modalType == 'close') {
      this.submitBtnTxt = 'Close';
      this.modalTitle = 'Close Iteration';
    }
    this.createUpdateIterationDialog.open();
  }

  actionOnOpen() {
    setTimeout(() => {
      this.itrname.nativeElement.focus();
    }, 200);
  }

  actionOnClose() {
    this.resetValues();
  }

  onStartDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    // Format 2016-11-29T23:18:14Z
    this.startDate = { date: event.date };
    this.iteration.attributes.startAt = moment(event.jsdate).format('YYYY-MM-DD') + 'T12:00:00Z';

    let endDatePickerComponentCopy = Object.assign({}, this.endDatePickerOptions);
    endDatePickerComponentCopy['disableUntil'] = event.date;
    this.endDatePickerOptions = endDatePickerComponentCopy;
  }

  onEndDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    this.endDate = { date: event.date };
    this.iteration.attributes.endAt = moment(event.jsdate).format('YYYY-MM-DD') + 'T12:00:00Z';
    let startDatePickerComponentCopy = Object.assign({}, this.startDatePickerOptions);
    startDatePickerComponentCopy['disableSince'] = event.date;
    this.startDatePickerOptions = startDatePickerComponentCopy;
  }

  iterationSearchFocus() {
    if (!this.iterationSearchDisable) {
      if (this.showIterationDropdown) {
        this.showIterationDropdown = false;
      } else {
        this.filteredIterations = this.iterationsValue;
        this.showIterationDropdown = true;
      }
    }
  }

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

  setParentIteration(value: any) {
    this.selectedParentIteration =  this.iterations.find((iteration) => iteration.id === value.key);
    this.selectedParentIterationName = value.value;
    this.iterationSearch.nativeElement.focus();
    // this.iteration.relationships.parent.data.id = this.selectedParentIteration.id;
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
          this.setParentIteration(item);
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
        this.selectedParentIteration = null;
      }
    }
  }

  actionOnSubmit() {
    this.iteration.attributes.name = this.iteration.attributes.name.trim();
    if (this.iteration.attributes.name !== '') {
      if (this.iteration.attributes.name.indexOf('/') === -1 &&
          this.iteration.attributes.name.indexOf('\\') === -1 ) {
        this.validationError = false;
        if (this.modalType == 'create' || this.modalType == "createChild") {
          this.iterationService.createIteration(this.iteration, this.selectedParentIteration)
              .subscribe((iteration) => {
                this.onSubmit.emit(iteration);
                this.resetValues();
                this.createUpdateIterationDialog.close();
          },
          (e) => {
            this.validationError = true;
            console.log('Some error has occured', e);
          });
        } else {
          if (this.modalType == 'start') {
            this.iteration.attributes.state = 'start';
          } else if (this.modalType == 'close') {
            this.iteration.attributes.state = 'close';
            this.iteration.attributes.user_active = false;
          } else {
            // Not include state if it's just an update
            delete this.iteration.attributes.state;
          }
          this.iterationService.updateIteration(this.iteration)
            .subscribe((iteration) => {
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
            },
            (e) => {
              this.spaceError = true;
              // this.resetValues();
              // console.log('Some error has occured', e.toString());
            });
        }
      } else {
        this.validationError = true;
        this.validationString = '/ or \\ are not allowed in iteration name.';
      }
      } else {
        this.validationError = true;
        this.validationString = 'This field is required.';
      }
  }

  removeError() {
    this.validationError = false;
  }

  onChecked(event) {
    this.iteration.attributes.user_active = event;
  }
}
