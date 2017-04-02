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
    // this.log({ message: `The forge api is ${this.apiUrl}`, warning: true });
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
        return this.GetCommand(url)
        .do((commandBeginResponse: IForgeCommandResponse) => {
          // Configure and set the next command pipeline stage to be submitted
          this.updateResponseContext(commandRequest, commandBeginResponse);
        });
      }
      case CommandPipelineStep.next: {
        let url = `${api}/forge/commands/${currentForgeCommandName}/next`;
        // Every 'next' command must first be validated ... so set the current step to validate first
        currentPipeline.step.name = CommandPipelineStep.validate;
        return this.forgeHttpCommandRequest(commandRequest)
          .switchMap((commandValidationResponse: IForgeCommandResponse) => {
            // restore the original step name
            currentPipeline.step.name=CommandPipelineStep.next;

            let forgeData = commandValidationResponse.payload.data;
            if ( forgeData.state.valid ) {
              // The submitted forge inputs were valid. Now execute the 'next' command pipeline stage.
              let body = currentParameters.data; //TODO : use validation response ???
              body[ 'stepIndex' ] = currentPipeline.step.index;
              // Validation is good, now run the 'next' step
              return this.PostCommand(url, body)
                .do((commandResponse: IForgeCommandResponse) => {
                  // Update the context with  the next step to be submitted.
                  this.updateResponseContext(commandRequest, commandResponse);
                });
            } else {
              // Validation is bad...Update the context with the next step (i.e current step) to be submitted.
              this.updateResponseContext(commandRequest, commandValidationResponse);
              // Return the observable response
              return Observable.from([ commandValidationResponse ]);
            }
        });
      }
      case CommandPipelineStep.validate: {
        let url = `${api}/forge/commands/${currentForgeCommandName}/validate`;
        let body = currentParameters.data || {};
        return this.PostCommand(url, body);
      }
      case CommandPipelineStep.execute: {
        let url = `${api}/forge/commands/${currentForgeCommandName}/execute`;
        let body = currentParameters.data;
        return this.PostCommand(url, body);
      }
      default: {
        this.log({
                   message: `Invalid forge command:${currentCommand.name}
                   step:${currentParameters.pipeline.step.name}`,
                   error: true
                 });
        return Observable.empty();
      }
    }
  }

  /**
   * Forge commands are broken up into several http requests or stages. This function appends
   * the next command pipeline stage to the response payload context property.
   * @param request : forge request submitted.
   * @param response : forge response received as a result of the submitted request.
   */
  private updateResponseContext(request: IForgeCommandRequest, response: IForgeCommandResponse) {
    let currentCommand = request.payload.command;
    let currentParameters = currentCommand.parameters;
    let currentPipeline: IForgeCommandPipeline = currentParameters.pipeline;
    let currentResponseState = response.payload.data.state;

    let nextPipeline: IForgeCommandPipeline = { step: { name: currentPipeline.step.name, index:0 } };
    let nextParameters: IForgeCommandParameters = {
      commandName: currentParameters.commandName,
      pipeline: nextPipeline
    };
    let nextCommand: IForgeCommand = { 
      name: currentCommand.name, 
      parameters: nextParameters 
    };
    let commandInfo=`${currentParameters.commandName}`;
    
    if ( currentResponseState.valid ) {
      if ( currentResponseState.wizard === true ) {
        nextPipeline.step.name = CommandPipelineStep.next;
        // handle next step index. Note : the index is 1-based not zero-based
        if(currentResponseState.canMoveToNextStep === true)
        {
            if ( currentPipeline.step.name === CommandPipelineStep.next ) {
              nextPipeline.step.index = currentPipeline.step.index + 1;
            } else {
              nextPipeline.step.index = 1;
            }
            commandInfo=`${currentParameters.commandName} step ${currentPipeline.step.index} ${currentPipeline.step.name}`;
        } else {
          nextPipeline.step.index = currentPipeline.step.index;
        }
        // Note: these next values will be updated where changes are made on the client.
        // This just serves as a reference point to allow for detecting changes.
        nextParameters.data = response.payload.data;
      }
      // handle the canExecute  
      if ( currentResponseState.canExecute ) {
        nextPipeline.step.name = CommandPipelineStep.execute;
        nextPipeline.step.index = currentPipeline.step.index;
      }
      this.log( { message:`The forge response indicates that all supplied inputs for ${commandInfo} were valid.`, info:true } );
    } else {
      //response is not valid
      nextParameters.data = response.payload.data;
      //this is where the app fields wil go
      nextParameters.pipeline.step.name = CommandPipelineStep.next;
      nextParameters.pipeline.step.index = currentPipeline.step.index;
      nextCommand = { 
        name: currentCommand.name, 
        parameters: nextParameters 
      };
      commandInfo=`${currentParameters.commandName} step ${currentPipeline.step.index} ${currentPipeline.step.name}`;
      this.log( { message:`The forge response indicates that one or more supplied inputs for ${commandInfo} were NOT valid.`,warning:true } );
    }
    // console.dir(nextCommand);
    response.context = response.context || {};
    // Clone the command that resulted in the current payload
    response.context.currentCommand=JSON.parse(JSON.stringify(currentCommand));
    // Add the next command that must be executed to proceed to the next step
    response.context.nextCommand = nextCommand;
  }

  private log: ILoggerDelegate = () => {};

}
