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
  selector: './app-generator-multiple-selection-searchable-list',
  templateUrl: './app-generator-multiple-selection-searchable-list.component.html',
  styleUrls: [ './app-generator-multiple-selection-searchable-list.component.scss' ]
})
export class AppGeneratorMultipleSelectionSearchableListComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() field: IField = <IField>{ name: '', value: '', display: { choices: [] }};
  @Input() appGenerator: ForgeAppGeneratorServiceClient;

  constructor(
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, AppGeneratorMultipleSelectionSearchableListComponent.instanceCount++);
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

  // behaviors
  allOptionsSelected(field: IField): boolean {
    return !field.display.choices.find((i) => i.selected === false);
  }

  selectOption(field: IField, choice: IFieldChoice) {
    choice.selected = true;
    this.updateFieldValue(field);
  }
  toggleOption(field: IField, choice: IFieldChoice) {
    choice.selected = !choice.selected;
    this.updateFieldValue(field);
  }

  deselectOption(field: IField, choice: IFieldChoice) {
    choice.selected = false;
    this.updateFieldValue(field);
  }

  updateFieldValue(field: IField): IField {
    if ( !field ) {
      return null;
    }
    switch (field.display.inputType) {
      case FieldWidgetClassificationOptions.MultipleSelection:
      {
        if ( field.display.hasChoices ) {
          field.value = field.display.choices
          .filter((o) => o.selected)
          .map((o) => o.id);
        } else {
          field.value = [];
        }
        this.appGenerator.validate();
        break;
      }
      default: {
        break;
      }
    }
    return field;
  }

  deselectAllOptions(field: IField) {
    field.display.choices.forEach((o) => {
      o.selected = false;
    });
  }

  filterList(field: IField, filter: string) {
    // TODO: better validation of bad chars
    filter = filter.replace('*', '');
    filter = filter.replace('?', '');
    filter = filter.replace('/', '');
    filter = filter.replace('\\', '');
    let r = new RegExp(filter || '', 'ig');
    field.display.choices.filter((o) => {
      // set everything to not visible, except for selected
      o.visible = false;
      if (o.selected === true) {
        o.visible = true;
      }
      // then match the input string
      return ((o.id.match(r)) || []).length > 0;
    })
    .forEach(o => {
      o.visible = true;
    });

  }

  selectAllOptions(field: IField) {
    field.display.choices.forEach((o) => {
      o.selected = true;
    });
  }

  toggleSelectAll(field: IField) {
    if ( !field ) {
      return;
    }
    // at least one not selected, then select all , else deselect all
    let item = field.display.choices.find((i) => i.selected === false);
    if ( item ) {
      for ( let o of field.display.choices ) {
        o.selected = true;
      }
    } else {
      for ( let o of field.display.choices ) {
        o.selected = false;
      }
    }
    this.updateFieldValue(field);
  }



}

