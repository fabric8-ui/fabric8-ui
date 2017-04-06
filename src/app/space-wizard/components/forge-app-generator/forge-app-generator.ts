//
import { Observable, Observer } from 'rxjs/Rx';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../../models/workflow';

import {
  IAppGeneratorCommand,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorResponseContext,
  IAppGeneratorService,
  IAppGeneratorState,
  IField,
  IFieldCollection
} from '../../services/app-generator.service';

interface IAppGeneratorError
{
  message:string;
  details:string;
  inner:any
};

interface IRequestResponsePair
{
   request:IAppGeneratorRequest;
   response: IAppGeneratorResponse;
}

export class ForgeAppGenerator {
  static instanceCount: number = 1;

  workflow: IWorkflow;
  name: string;
  state: IAppGeneratorState;
  processing:Boolean = false;

  private _fieldSet: IFieldCollection;
  private _responseHistory: Array<IAppGeneratorResponse>;
  private currentResponse: IAppGeneratorResponse;

  constructor(private _appGeneratorService: IAppGeneratorService, loggerFactory: LoggerFactory) {
    this.log = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGenerator.instanceCount++);
    this.state = {
      canExecute: false,
      canMovePreviousStep :false ,
      canMoveToNextStep :false,
      currentStep: 0,
      steps:[''],
      title: '',
      description: '',
      valid: false
    } as IAppGeneratorState
    this.fields = [];
    this.clearErrors();
    this.processing = false;
  }

  private get responseHistory(): Array<IAppGeneratorResponse> {
    this._responseHistory = this._responseHistory || [];
    return this._responseHistory;
  };

  private set responseHistory(value: Array<IAppGeneratorResponse>) {
    this._responseHistory = value;
  };

  get fields(): IFieldCollection {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }

  set fields(value: IFieldCollection) {
    this._fieldSet = value;
  }

  begin() {
    this.reset()
    this.processing = true;
    let request: IAppGeneratorRequest = {
      command: {
        name: `${this.name}`
      }
    };
    let commandInfo = `${request.command.name}`;
    this.log(`Begin request for command ${commandInfo}.`,request);
    return this._appGeneratorService.getFields(request)
    .subscribe(response => {
      this.log(`Begin response for command ${commandInfo}.`,request);
      this.applyNextCommandResponse(request, response);
      // do an initial validate
      this.validate();
      this.processing = false;
    },(error)=>{
      this.handleError(error);
      this.processing = false;
    });
  }

  applyNextCommandResponse(request: IAppGeneratorRequest,
                response: IAppGeneratorResponse) {

    let cmd: IAppGeneratorCommand = response.context.currentCommand;
    //let currentCommandForgeData: IForgeCommandData = cmd.parameters.data;

    this.state = response.payload.state;// currentCommandForgeData.state;
    let previousResponse = this.currentResponse;
    if( previousResponse )
    {
        this.responseHistory.push(previousResponse);
        this.log(`Stored fieldset[${previousResponse.payload.fields.length}] into fieldset history
                  ... there are ${this.responseHistory.length} responses in history ...`);

    }
    this.currentResponse = response;
    this.fields = response.payload.fields;
  }

  public validate(){
    return new Promise<IRequestResponsePair>((resolve,reject)=>{
      // update the values to be validated
      let cmd: IAppGeneratorCommand = this.currentResponse.context.validationCommand;
      for( let field of this.fields)
      {
        let requestField = cmd.parameters.fields.find((f)=>f.name === field.name);
        requestField.value = field.value;
      }

      let request: IAppGeneratorRequest = {
        command: cmd
      };
      let commandInfo = `${cmd.name}:${cmd.parameters.pipeline.step.name}:${cmd.parameters.pipeline.step.index}`;
      this.log(`Validation request for command ${commandInfo}.`, request, console.group );
      this.processing = true;
      this._appGeneratorService.getFields( request )
        .subscribe( (response) => {
          let validationState = response.payload.state;
          this.log({
            message: `Validation response for command ${commandInfo}.`,
            info: validationState.valid,
            warning:!validationState.valid
          },response,console.groupEnd);

          // only assign these state fields ... not the entire state
          this.state.canExecute = validationState.canExecute;
          this.state.canMoveToNextStep = validationState.canMoveToNextStep;
          this.state.canMovePreviousStep = validationState.canMovePreviousStep;
          this.state.valid = validationState.valid;

          let validatedFields:IFieldCollection=[];
          for( let field of this.fields)
          {
            let found=response.payload.fields.find((f)=>f.name === field.name);
            // only need to update the display properties
            field.display=found.display;
          }
          if(this.state.valid) {
            resolve({request,response});
          }
          this.processing = false;

        },( error =>{
          this.processing = false;
          reject({message:'Something went wrong while attempting to validate the information on this page.', inner: error} );
        }));
    });
  }

  public hasError: Boolean;

  public error:IAppGeneratorError

  clearErrors(){
    this.hasError = false;
    this.error=this.error||{} as IAppGeneratorError;
    this.error.message = '';
    this.error.details = '';
    this.error.inner = '';
  }


  private handleError(error): Observable<any> {
    this.log({ message: error.message, inner: error.inner, error: true });

    this.hasError = true;
    this.error = {
      message:`
      Something went wrong while attempting to perform this operation.`,
      details:`
      ${error.message||'No details available.'}
      `,
      inner:error.inner?JSON.stringify(error.inner):''
    } as IAppGeneratorError;
    return Observable.empty();
  }

  gotoNextStep() {
    this.processing = true;
    this.validate().then((validated)=>{
      let command: IAppGeneratorCommand = this.currentResponse.context.nextCommand;
      command.parameters.fields = this.fields;
      //pass along the validated data and fields
      command.parameters.validatedData=validated.request.command.parameters.data
      let request: IAppGeneratorRequest = {
        command: command
      };
      let commandInfo = `${command.name}:${command.parameters.pipeline.step.name}:${command.parameters.pipeline.step.index}`;
      this.log(`Next request for command ${commandInfo}.`,request,console.group);
      this._appGeneratorService.getFields( request )
        .subscribe( (response) => {
          this.log(`Next reponse for command ${commandInfo}.`,request);
          this.applyNextCommandResponse( request, response );
          this.processing=false;
        }, (error)=>{
          this.processing=false;
          this.handleError(error);
        });

    }).catch(error=>{
      this.processing=false;
      this.handleError(error);
      this.log({ message:error.message, warning:true } )
    })
    // TODO: need a way to be aware that the app generator pipeline is complete
    // if(this.workflow)
    // {
    //   this.workflow.gotoNextStep();
    // }

  }

  gotoPreviousStep() {
    let response = this.responseHistory.pop();
    this.fields = response.payload.fields;
    this.log(`Restored fieldset[${response.payload.fields.length}] from fieldset history
              ... there are ${this.responseHistory.length} items in history ...`);
  }

  execute() {
    this.processing = true;
    this.validate().then((validated)=>{
      let command: IAppGeneratorCommand = validated.response.context.executeCommand;
      //pass along the validated data and fields
      let request: IAppGeneratorRequest = {
        command: command
      };
      let commandInfo = `${command.name}:${command.parameters.pipeline.step.name}:${command.parameters.pipeline.step.index}`;
      this.log(`Next request for command ${commandInfo}.`,request,console.group);
      this._appGeneratorService.getFields( request )
        .subscribe( (response) => {
          this.log(`Next reponse for command ${commandInfo}.`,request);
          this.applyNextCommandResponse( request, response );
          this.processing=false;
        }, (error)=>{
          this.processing=false;
          this.handleError(error);
        });

    }).catch(error=>{
      this.processing=false;
      this.handleError(error);
      this.log({ message:error.message, warning:true } )
    })
  }

  reset() {
    this.responseHistory = [];
    this.currentResponse = null;
    this.fields = [];
    this.clearErrors();
  }

  finish() {
    this.execute()
    //this.workflow.finish();
    //this.reset();
  }

  cancel() {
    this.reset();
    this.workflow.cancel();
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };

}
