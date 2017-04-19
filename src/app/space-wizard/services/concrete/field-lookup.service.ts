import { Injectable } from '@angular/core';

import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

@Injectable()
export class FieldLookupService {

  static instanceCount: number = 1;

  constructor(loggerFactory: LoggerFactory){

    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, FieldLookupService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);

  }

  private log: ILoggerDelegate = () => {};

}
