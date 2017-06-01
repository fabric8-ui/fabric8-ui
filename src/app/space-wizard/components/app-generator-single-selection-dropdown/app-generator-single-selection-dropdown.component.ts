import { Component, Input, OnDestroy, OnInit } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

import { ForgeAppGenerator } from './forge-app-generator';

import {
  IField,
  IFieldChoice
} from '../../services/app-generator.service';

import { ForgeAppGeneratorServiceClient } from '../forge-app-generator/forge-app-generator-service-client';
import { FieldWidgetClassificationOptions } from '../../models/contracts/field-classification';

@Component({
  selector: 'app-generator-single-selection-dropdown',
  templateUrl: './app-generator-single-selection-dropdown.component.html',
  styleUrls: [ './app-generator-single-selection-dropdown.component.scss' ]
})
export class AppGeneratorSingleSelectionDropDownComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() field: IField = <IField>{ name: '', value: '', display: { choices: [] }};
  @Input() appGenerator: ForgeAppGeneratorServiceClient;

  constructor(
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, AppGeneratorSingleSelectionDropDownComponent.instanceCount++);
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

