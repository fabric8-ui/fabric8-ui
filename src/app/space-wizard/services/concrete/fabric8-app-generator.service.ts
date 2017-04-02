import { Inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
/** contracts  */
import {
  AppGeneratorService,
  FieldCollection,
  FieldWidgetClassification,
  FieldWidgetClassificationOptions,
  IAppGeneratorCommand,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorResponseContext,
  IField,
  IFieldCollection,
  IFieldChoice
} from '../contracts/app-generator-service';
/** dependencies */
import {
  IForgeCommandRequest,
  IForgeCommandResponse,
  IForgeInput,
  IForgeService,
  IForgeServiceProvider,
  IForgeCommandPipeline
} from '../forge.service';

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;

  getFields(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    return this.executeForgeCommand(options);
  }

  constructor(
    @Inject(IForgeServiceProvider.InjectToken) private forgeService: IForgeService,
    loggerFactory: LoggerFactory) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8AppGeneratorService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }

  private handleError(err): Observable<any> {
    let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
    this.log({ message: errMessage, inner: err, error: true });
    return Observable.throw(new Error(errMessage));
  }

  /**
   * update the values that will be transmitted to forge with the form
   * field values transmitted from the application.
   */
  private updateForgeInputsWithFieldValues(command: IAppGeneratorCommand): IAppGeneratorCommand {
    if ( command.parameters && command.parameters.fields ) {
      for ( let field of <IFieldCollection>command.parameters.fields ) {
        let inputs: Array<IForgeInput> = command.parameters.data.inputs;
        let input:IForgeInput = inputs.find( i => i.name === field.name );
        if ( input ) {
          input.value = field.value;
        }
      }
    }
    return command;
  }
  /** initializes the command with default values */
  private initializeComand(value:Partial<IAppGeneratorCommand>):IAppGeneratorCommand
  {
    let emptyComand:IAppGeneratorCommand = {
      name: '',
      parameters: {
        commandName: '',
        pipeline: {
          step: {
            name: '',
            index: 0
          }
        },
        fields: [],
        data: { 
          inputs: [] 
        }
      }
    };
    value = value || { name: '' };
    value.name = value.name||'';
    value.parameters = value.parameters || emptyComand.parameters;
    // fields
    value.parameters.fields = value.parameters.fields || [];
    // data
    value.parameters.data = value.parameters.data || { inputs: [] };
    // pipeline
    value.parameters.pipeline = value.parameters.pipeline || emptyComand.parameters.pipeline;
    value.parameters.pipeline.step = value.parameters.pipeline.step || emptyComand.parameters.pipeline.step;
    value.parameters.pipeline.step.name = value.parameters.pipeline.step.name || 'begin';
    value.parameters.pipeline.step.index = value.parameters.pipeline.step.index || 0;
    
    return value as IAppGeneratorCommand;

  }

  private executeForgeCommand(request: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    let command = this.updateForgeInputsWithFieldValues(request.command);
    this.log(`App generator invoking the forge service for command = ${request.command.name} ...`);
    console.dir(command);
    return Observable.create((observer: Observer<IAppGeneratorResponse>) => {
      request.command = this.initializeComand(request.command);
      let commandRequest: IForgeCommandRequest = {
        payload: {
          command: request.command
        }
      };
      this.forgeService.executeCommand(commandRequest)
      .map((forgeResponse) => this.transformForgeResponseToAppGeneratorResponse(forgeResponse))
      .catch((err) => this.handleError(err))
      .subscribe((response: IAppGeneratorResponse) => {
        this.log(`App generator ${command.name} command executed:`);
        console.dir(response);
        observer.next(response);
        observer.complete();
      });
    });
  }

  private transformForgeResponseToAppGeneratorResponse(source: IForgeCommandResponse): IAppGeneratorResponse {
    let fields = new FieldCollection();
    // this.log('mapForgeResponseToAppGeneratorResponse...');

    source.payload = source.payload || { data: { inputs: [] } };
    source.payload.data = source.payload.data || { inputs: [] };
    source.payload.data.inputs = source.payload.data.inputs || [];

    for ( let sourceInput of <IForgeInput[]>source.payload.data.inputs ) {
      let targetField: IField = {
        name: sourceInput.name,
        value: sourceInput.value,
        valueType: this.mapFieldValueDataType(sourceInput),
        display: {
          choices: this.mapValueOptions(sourceInput),
          hasChoices: this.mapValueHasOptions(sourceInput),
          description:sourceInput.description,
          inputType: this.mapWidgetClassification(sourceInput),
          label: sourceInput.label,
          required: sourceInput.required,
          enabled: sourceInput.enabled,
          visible: sourceInput.deprecated === false,
          index: 0
        }
      };
      if ( targetField.display.hasChoices
        && targetField.display.inputType === FieldWidgetClassificationOptions.MultipleSelection ) {
        // change to an array for binding purposes
        targetField.value = [];
      }
      // add dynamic fields that vary with payload
      if ( sourceInput.note ) {
        targetField.display.note = sourceInput.note;
      }
      if ( source.payload.data.messages ) {
        for ( let message of source.payload.data.messages ) {
          if ( message.input === sourceInput.name ) {
            targetField.display.message = message;
          }
        }
      }
      fields.push(targetField);
    }
    return {
      payload: { fields: fields },
      context: (()=>{
        let ctx:IAppGeneratorResponseContext=source.context;
        return ctx;
      })() 
    } as IAppGeneratorResponse;
  }

  private mapValueHasOptions(source: IForgeInput): boolean {
    if ( source.valueChoices ) {
      return source.valueChoices.length > 0;
    }
    return false;
  }

  private mapValueOptions(source: IForgeInput): Array<IFieldChoice> {
    let items: Array<IFieldChoice> = [];
    if ( source.valueChoices ) {
      for ( let choice of source.valueChoices ) {
        if ( source.description ) {
          items.push({
                       id: choice.id,
                       name: choice.description,
                       description: choice.description,
                       visible: true,
                       selected: false
                     });
        } else {
          items.push({
                       id: choice.id,
                       name: choice.id,
                       description: choice.id,
                       visible: true,
                       selected: false
                     });

        }
      }
    }
    return items;
  }

  private mapFieldValueDataType(source: IForgeInput): string {
    if ( !source.valueType ) {
      return 'string';
    }
    switch ( (source.valueType || '').toLowerCase() ) {
      case 'java.lang.string': {
        return 'string';
      }
      case 'java.lang.boolean': {
        return 'boolean';
      }
      case 'java.lang.integer': {
        return 'number';
      }
      case 'org.jboss.forge.addon.projects.projectType': {
        return 'stackVariant';
      }
      default: {
        return 'string';
      }
    }
  }

  private mapWidgetClassification(source: IForgeInput): FieldWidgetClassification {
    switch ( (source.class || '').toLowerCase() ) {
      case 'uiinput': {
        return FieldWidgetClassificationOptions.SingleInput;
      }
      case 'uiselectone': {
        return FieldWidgetClassificationOptions.SingleSelection;
      }
      case 'uiselectmany': {
        return FieldWidgetClassificationOptions.MultipleSelection;
      }
      default: {
        return FieldWidgetClassificationOptions.SingleInput;
      }
    }
  }

  private mapFieldSetToRequest(source: IFieldCollection): IForgeCommandRequest {
    return { payload: { command: { name: '' } } };
  }

  // default logger does nothing when called
  private log: ILoggerDelegate = () => {};

}



