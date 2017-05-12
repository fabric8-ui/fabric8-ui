import { ViewEncapsulation, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { INotifyPropertyChanged } from '../../core/component';

import { IWorkflow, IWorkflowTransition, WorkflowTransitionDirection } from '../../models/workflow';

import {
  IAppGeneratorService,
  IAppGeneratorServiceProvider,
  IField,
  IFieldChoice
} from '../../services/app-generator.service';

import { ForgeAppGenerator } from './forge-app-generator';
import { FieldWidgetClassificationOptions } from '../../models/contracts/field-classification';

@Component({
  selector: 'forge-pipeline-view',
  templateUrl: './forge-pipeline-view.component.html',
  styleUrls: [ './forge-pipeline-view.component.scss' ]
})
export class ForgePipelineViewComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  public pipeline: any = {
    stages:[
      { name:'Release',details:'2 minutes',color:'success' , icon:'fa-check-circle' },
      { name:'Test',details:'5 minutes',color:'success' , icon:'fa-check-circle' },
      { name:'Stage',details:'3 min',color:'success' , icon:'fa-check-circle' },
      { name:'Approve',details:'click to approve...',color:'warning' , icon:'fa-pause-circle' },
    ]};

  constructor(
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgePipelineViewComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance ...`);
  }

  ngOnInit() {
    this.log(`ngOnInit ...`);
  }

  ngOnDestroy() {
    this.log(`ngOnDestroy ...`);
  }
  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => {};

}

