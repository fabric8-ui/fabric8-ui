import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { INotifyPropertyChanged } from '../../core/component';

import { IWorkflow, IWorkflowTransition, WorkflowTransitionDirection } from '../../models/workflow';

import {
  IAppGeneratorService,
  IAppGeneratorServiceProvider,
  IFieldInfo,
  IFieldValueOption
} from '../../services/app-generator.service';

import { ForgeAppGenerator } from './forge-app-generator';
import { FieldWidgetClassificationOptions } from '../../models/contracts/field-classification';

@Component({
  host: {
   'class': 'wizard-step'
  },
  selector: 'forge-app-generator',
  templateUrl: './forge-app-generator.component.html',
  styleUrls: [ './forge-app-generator.component.scss' ],
  providers: [ IAppGeneratorServiceProvider.FactoryProvider ]
})
export class ForgeAppGeneratorComponent implements OnInit, OnDestroy, OnChanges {

  // keep track of the number of instances
  static instanceCount: number = 1;

  public forge: ForgeAppGenerator = null;
  @Input() title: string = 'Forge Command Wizard';
  @Input() stepName: string = '';
  @Input() commandName: string = '';

  private _workflow: IWorkflow;

  constructor(
    @Inject(IAppGeneratorServiceProvider.InjectToken) private _appGeneratorService: IAppGeneratorService,
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGeneratorComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance ...`);
    this.forge = new ForgeAppGenerator(this._appGeneratorService, loggerFactory);
  }

  @Input()
  get workflow(): IWorkflow {
    return this._workflow;
  }

  set workflow(value: IWorkflow) {
    this._workflow = value;
  };

  /**
   * All inputs are bound and values assigned, but the 'workflow' get a new instance every time the parents host dialog
   * is opened.
   */
  ngOnInit() {
    this.log(`ngOnInit ...`);
    this.forge.name = this.commandName;
    this.forge.workflow = this.workflow;
  }

  ngOnDestroy() {
    this.log(`ngOnDestroy ...`);
  }

  /** handle all changes to @Input properties */
  ngOnChanges(changes: SimpleChanges) {
    for ( let propName in changes ) {
      if ( changes.hasOwnProperty(propName) ) {
        this.log(`ngOnChanges ...${propName}`);
        switch ( propName.toLowerCase() ) {
          case 'workflow': {
            let change: INotifyPropertyChanged<IWorkflow> = <any>changes[ propName ];
            this.onWorkflowPropertyChanged(change);
            break;
          }
          default : {
            break;
          }
        }
      }
    }
  }

  allOptionsSelected(field: IFieldInfo): boolean {
    return !field.display.options.find((i) => i.selected === false);
  }

  selectOption(field: IFieldInfo, option: IFieldValueOption) {
    option.selected = true;
    this.updateFieldValue(field);
  }

  deselectOption(field: IFieldInfo, option: IFieldValueOption) {
    option.selected = false;
    this.updateFieldValue(field);
  }

  updateFieldValue(field: IFieldInfo): IFieldInfo {
    if ( !field ) {
      return null;
    }
    if ( field.display.hasOptions ) {
      field.value = field.display.options
      .filter((o) => o.selected)
      .map((o) => o.id);
    }
    if ( field.display.inputType === FieldWidgetClassificationOptions.SingleSelection) {
      if ( field.value.length > 0 ) {
        field.value = field.value[ 0 ];
      } else {
        field.value = '';
      }
    }
    return field;
  }

  deselectAllOptions(field: IFieldInfo) {
    field.display.options.forEach((o) => {
      o.selected = false;
    });
  }

  filterUnselectedList(field: IFieldInfo, filter: string) {
    let r = new RegExp(filter || '', 'ig');
    field.display.options.filter((o) => {
      o.visible = false;
      return ((o.id.match(r)) || []).length > 0;
    })
    .forEach(o => {
      o.visible = true;
    });

  }

  selectAllOptions(field: IFieldInfo) {
    field.display.options.forEach((o) => {
      o.selected = true;
    });
  }

  toggleSelectAll(field: IFieldInfo) {
    if ( !field ) {
      return;
    }
    // at least one not selected, then select all , else deselect all
    let item = field.display.options.find((i) => i.selected === false);
    if ( item ) {
      for ( let o of field.display.options ) {
        o.selected = true;
      }
    } else {
      for ( let o of field.display.options ) {
        o.selected = false;
      }
    }
    this.updateFieldValue(field);
  }

  private onWorkflowPropertyChanged(change?: INotifyPropertyChanged<IWorkflow>) {
    if ( change ) {
      if ( change.currentValue !== change.previousValue ) {
        this.log(`The workflow property changed value ...`);
        let current: IWorkflow = change.currentValue;
        this.forge.workflow = current;
        this.subscribeToWorkflowTransitions(current);
      }
    }
  };

  private isTransitioningToThisStep(transition: IWorkflowTransition): boolean {
    return transition.to && transition.to.name.toLowerCase() === this.stepName.toLowerCase();
  };

  private isTransitioningFromThisStep(transition: IWorkflowTransition): boolean {
    return transition.from && transition.from.name.toLowerCase() === this.stepName.toLowerCase();
  };

  private subscribeToWorkflowTransitions(workflow: IWorkflow) {
    if ( !workflow ) {
      return;
    }
    this.log(`Subscribing to workflow transitions ...`);
    workflow.transitions.subscribe((transition) => {
      this.log({
                 message: `Subscriber responding to an observed '${transition.direction}' workflow transition:
      from ${transition.from ? transition.from.name : 'null'} to ${transition.to ? transition.to.name : 'null'}.`
               });
      if ( this.isTransitioningToThisStep(transition) ) {
        this.forge.begin();
      }
      if ( this.isTransitioningFromThisStep(transition) ) {
        switch ( transition.direction ) {
          case WorkflowTransitionDirection.NEXT: {
            // arrived at this point in the workflow as the result of a nextStep transition
            break;
          }
          case WorkflowTransitionDirection.GO: {
            // arrived at this point in the workflow as the result of a goToStep transition
            break;
          }
          default: {
            break;
          }

        }
      }
    });
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => {};

}

