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

@Injectable()
export class Fabric8ForgeService extends ForgeService {

  static instanceCount: number = 1;

  private apiUrl: string;

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
    this.apiUrl = apiLocator.forgeApiUrl;
    this.log({ message: `The forge api is ${this.apiUrl}`, warning: true });
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
      this.log(`retrieving authorization token...`);
      this.addAuthorizationHeaders(headers)
      .subscribe(() => {
        let options = new RequestOptions(<RequestOptionsArgs>{ headers: headers });
        this.log(`forge GET : ${url}`);
        this._http.get(url, options)
        .map((response) => {
          let forgeResponse: IForgeCommandResponse = {
            payload: {
              data: response.json()
            }
          };
          this.log(`forge GET response : ${url}`);
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
      this.log(`forge POST : ${url}`);
      console.dir(body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      this.log(`retrieving authorization token...`);
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
          this.log(`forge POST response : ${url}`);
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

  private forgeHttpCommandRequest(request: IForgeCommandRequest): Observable<IForgeCommandResponse> {
    let currentCommand = request.payload.command;
    let currentParameters = currentCommand.parameters;
    let currentForgeCommandName = currentParameters.commandName;
    let currentPipeline: IForgeCommandPipeline = currentParameters.pipeline;
    let api: string = Location.stripTrailingSlash(this.apiUrl || '');
    // build the url based on the workflow step and the system name
    switch ( currentPipeline.stage.name ) {
      case 'begin': {
        let url = `${api}/forge/commands/${currentForgeCommandName}`;
        currentPipeline.stage.index = 0;
        return this.GetCommand(url)
        .do((response: IForgeCommandResponse) => {
          // Configure and set the next command pipeline stage to be submitted
          this.appendNextCommandPipelineStage(request, response);
        });
      }
      case 'next': {
        let url = `${api}/forge/commands/${currentForgeCommandName}/next`;
        // Every 'next' command must first be validated ... so set the stage to validate first
        currentPipeline.stage.name = 'validate';
        return this.forgeHttpCommandRequest(request)
        .switchMap((response: IForgeCommandResponse) => {
          let forgeData = response.payload.data;
          if ( forgeData.state.valid ) {
            // The submitted forge inputs were valid. Now execute the 'next' command pipeline stage.
            let body = currentParameters.data;
            body[ 'stepIndex' ] = currentPipeline.stage.index;
            // now execute and update the context next command
            return this.PostCommand(url, body)
            .do((fr: IForgeCommandResponse) => {
              // Configure and append the next command stage to be submitted.
              this.appendNextCommandPipelineStage(request, fr);
            });
          } else {
            // The submitted forge inputs were not valid. Configure and append the next command to resubmit the inputs.
            this.appendNextCommandPipelineStage(request, response);
            // Return the observable response
            return Observable.from([ response ]);
          }
        });
      }
      case 'validate': {
        let url = `${api}/forge/commands/${currentForgeCommandName}/validate`;
        let body = currentParameters.data || {};
        return this.PostCommand(url, body);
      }
      case 'execute': {
        let url = `${api}/forge/commands/${currentForgeCommandName}/execute`;
        let body = currentParameters.data;
        return this.PostCommand(url, body);
      }
      default: {
        this.log({
                   message: `Invalid forge command:${currentCommand.name}
                   step:${currentParameters.pipeline.stage.name}`,
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
  private appendNextCommandPipelineStage(request: IForgeCommandRequest, response: IForgeCommandResponse) {
    let currentCommand = request.payload.command;
    let currentParameters = currentCommand.parameters;
    let currentPipeline: IForgeCommandPipeline = currentParameters.pipeline;
    let responseState = response.payload.data.state;

    let nextPipeline: IForgeCommandPipeline = { stage: { name: currentPipeline.stage.name } };
    let nextParameters: IForgeCommandParameters = {
      commandName: currentParameters.commandName,
      pipeline: nextPipeline
    };
    let nextCommand: IForgeCommand = { name: currentCommand.name, parameters: nextParameters };

    if ( responseState.valid ) {
      this.log('The forge response indicates that the inputs are valid');
      if ( responseState.wizard === true && responseState.canMoveToNextStep === true ) {
        nextPipeline.stage.name = 'next';
        nextPipeline.stage.index = (currentPipeline.stage.index || 0) + 1;
        // Note: these next values will be updated where changes are made on the client
        // This just serves as a reference point to allow for detecting changes.
        nextParameters.data = response.payload.data;
      }
      if ( responseState.canExecute ) {
        nextPipeline.stage.name = 'execute';
      }
    } else {
      this.log('The forge response indicates that the inputs are not valid');
      nextParameters.data = response.payload.data;
      nextParameters.pipeline.stage.name = 'next';
      nextCommand = { name: currentCommand.name, parameters: nextParameters };
    }
    console.dir(nextCommand);
    response.context = response.context || {};
    response.context.nextCommand = nextCommand;
  }

  private log: ILoggerDelegate = () => {};

}
