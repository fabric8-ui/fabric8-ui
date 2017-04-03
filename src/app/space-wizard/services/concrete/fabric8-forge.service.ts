import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';

import { Observable, Observer } from 'rxjs/Rx';

import { ApiLocatorService } from '../../../shared/api-locator.service';

import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

import {
  ForgeCommands,
  ForgeService,
  IForgeCommand,
  IForgeCommandData,
  IForgeCommandParameters,
  IForgeCommandPipeline,
  IForgeCommandRequest,
  IForgeCommandResponse
} from '../contracts/forge-service';

class CommandPipelineStep
{
  public static begin = 'begin';
  public static next = 'next';
  public static validate = 'validate';
  public static execute = 'execute';
}

@Injectable()
export class Fabric8ForgeService extends ForgeService {

  static instanceCount: number = 1;

  private _apiUrl: string;

  executeCommand(request: IForgeCommandRequest = {
      payload: {
        command: {
          name: 'empty'
        }
      }
    }): Observable<IForgeCommandResponse> {
    let command = request.payload.command;
    // map the forge command system name into the parameters
    switch ( command.name ) {
      case ForgeCommands.forgeStarter: {
        command.parameters.commandName = 'obsidian-new-project';
        return this.forgeHttpCommandRequest(request);
      }
      case ForgeCommands.forgeQuickStart: {
        command.parameters.commandName = 'obsidian-new-quickstart';
        return this.forgeHttpCommandRequest(request);
      }
      case ForgeCommands.forgeImportGit: {
        command.parameters.commandName = 'fabric8-import-git';
        return this.forgeHttpCommandRequest(request);
      }
      default: {
        return Observable.empty();
      }
    }
  }

  constructor(private _http: Http, loggerFactory: LoggerFactory, apiLocator: ApiLocatorService,
    private _authService: AuthenticationService) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8ForgeService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);
    this._apiUrl = apiLocator.forgeApiUrl;
    if ( this._authService == null ) {
      this.log({ message: `Injected AuthenticationService is null`, warning: true });
    }
  }

  private handleError(error): Observable<any> {
    let errorMessage: string;
    if ( error instanceof Response ) {
      const body = error.json() || '';
      // const err = body.error || JSON.stringify(body);
      errorMessage = `${error.status} - ${error.statusText || ''} ${error}`;
    } else {
      errorMessage = error.message ? error.message : error.toString();
    }
    this.log({ message: errorMessage, inner: error, error: true });
    return Observable.throw(errorMessage);
  }

  private addAuthorizationHeaders(headers: Headers): Observable<void> {
    return Observable.create((s) => {

      let token = this._authService.getToken();
      headers.set('Authorization', `Bearer ${token}`);
      s.next();

    });
  }

  private GetCommand(url: string): Observable<IForgeCommandResponse> {
    return Observable.create((observer: Observer<IForgeCommandResponse>) => {
      let headers = new Headers();
      // this.log(`retrieving authorization token...`);
      this.addAuthorizationHeaders(headers)
      .subscribe(() => {
        let options = new RequestOptions(<RequestOptionsArgs>{ headers: headers });
        this.log(`Forge GET request  : ${url}`);
        this._http.get(url, options)
        .map((response) => {
          let forgeResponse: IForgeCommandResponse = {
            payload: {
              data: response.json()
            }
          };
          this.log(`Forge GET response : ${url}`);
          console.dir(forgeResponse.payload.data);
          return forgeResponse;
        })
        .catch((err) => this.handleError(err))
        .subscribe((response: IForgeCommandResponse) => {
          observer.next(response);
          observer.complete();
        });
      });
    });
  }

  private PostCommand(url: string, body: any): Observable<IForgeCommandResponse> {
    return Observable.create((observer: Observer<IForgeCommandResponse>) => {
      this.log(`Forge POST request  : ${url}`);
      console.dir(body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
       // this.log(`retrieving authorization token...`);
      this.addAuthorizationHeaders(headers)
      .subscribe(() => {
        let options = new RequestOptions(<RequestOptionsArgs>{ headers: headers });
        this._http.post(url, body, options)
        .map((response) => {
          let forgeResponse: IForgeCommandResponse = {
            payload: {
              data: <IForgeCommandData>response.json()
            }
          };
          this.log(`Forge POST response : ${url}`);
          console.dir(forgeResponse.payload.data);
          return forgeResponse;
        })
        .catch((err) => this.handleError(err))
        .subscribe((response: IForgeCommandResponse) => {
          observer.next(response);
          observer.complete();
        });
      });
    });
  }

  private forgeHttpCommandRequest(commandRequest: IForgeCommandRequest): Observable<IForgeCommandResponse> {
    let currentCommand = commandRequest.payload.command;
    let currentParameters = currentCommand.parameters;
    let currentForgeCommandName = currentParameters.commandName;
    let currentPipeline: IForgeCommandPipeline = currentParameters.pipeline;
    let api: string = Location.stripTrailingSlash(this._apiUrl || '');
    // build the url based on the workflow step and the system name
    switch ( currentPipeline.step.name ) {
      case CommandPipelineStep.begin: {
        let url = `${api}/forge/commands/${currentForgeCommandName}`;
        currentPipeline.step.index = 0;
        return this.GetCommand( url )
        .do( (commandBeginResponse: IForgeCommandResponse ) => {
          // Configure and set the next command pipeline stage to be submitted
          this.updateForgeHttpCommandResponseContext( commandRequest, commandBeginResponse );
        });
      }
      case CommandPipelineStep.validate: 
      case CommandPipelineStep.next:
      case CommandPipelineStep.execute: { 
        let url = `${api}/forge/commands/${currentForgeCommandName}/${currentPipeline.step.name}`;
        let body:IForgeCommandData = currentParameters.data ;
        if(body.state.wizard) {
          body[ 'stepIndex' ] = currentPipeline.step.index;
        }
        return this.PostCommand( url, body ).do( (response) => {
            this.updateForgeHttpCommandResponseContext(commandRequest, response);
        });
      }
      default: {
        this.log({
          message: `Invalid forge command step for command:${currentCommand.name}.
          step:${currentParameters.pipeline.step.name}`,
          error: true
        });
        return Observable.empty();
      }

    }
  }
  /**
   * Clone the object 
   * @param value 
   */
  private clone<T>(value:any):T
  {
    let clone=<T>JSON.parse(JSON.stringify( value || {} ));
    return clone;
  }
  /** 
   * Update the context with the validate, next and current commands
   */
  private updateForgeHttpCommandResponseContext(request: IForgeCommandRequest, response: IForgeCommandResponse){
    
    let currentCommand = request.payload.command;
    let currentParameters = currentCommand.parameters;
    let currentPipeline: IForgeCommandPipeline = currentParameters.pipeline;

    let currentResponseData = response.payload.data;
    let state = currentResponseData.state;

    let nextCommand = this.clone<IForgeCommand>(currentCommand);
    nextCommand.parameters.data = this.clone<IForgeCommandData>(response.payload.data);
    
    let validationCommand = this.clone<IForgeCommand>(nextCommand);
    validationCommand.parameters.pipeline.step.name = CommandPipelineStep.validate;

    let nextPipeline = <IForgeCommandPipeline>nextCommand.parameters.pipeline;
    let validationPipeline = <IForgeCommandPipeline>validationCommand.parameters.pipeline;

    if ( state.wizard === true ) {
      nextPipeline.step.name = CommandPipelineStep.next;
      validationPipeline.step.name = CommandPipelineStep.validate;
      if ( state.valid === true ) {
        if ( state.canMoveToNextStep === true ) {
          // can move only affects the step index
          switch( currentPipeline.step.name ) {
            case CommandPipelineStep.begin: {
              validationPipeline.step.index = 1;  
              nextPipeline.step.index =  1;
              break;
            }
            case CommandPipelineStep.validate : {
              // only increment the validation step for a validation scenario 
              // validationPipeline.step.index = validationPipeline.step.index + 1;  
              break;
            }
            case CommandPipelineStep.next : { 
              // increment both as the data reflects the next step 
              nextPipeline.step.index = nextPipeline.step.index + 1;
              validationPipeline.step.index = validationPipeline.step.index + 1;  
              break;
            }
            default :{
              break;
            }
          }
        }
      }
    }
    
    if( state.canExecute ) {
      nextPipeline.step.name = CommandPipelineStep.execute;  
    }

    response.context = response.context || {};
    response.context.nextCommand = nextCommand;
    response.context.validationCommand = validationCommand;
    response.context.currentCommand = this.clone(currentCommand);

  };

  private log: ILoggerDelegate = () => {};

}
