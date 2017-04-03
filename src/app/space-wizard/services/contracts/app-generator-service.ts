import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IField,
  IFieldCollection
} from '../../models/app-generator';

export {
  IFieldCollection,
  FieldCollection,
  IField,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorCommand,
  IAppGeneratorResponseContext,
  IAppGeneratorState,
  IAppGeneratorCommandParameters,
  FieldWidgetClassificationOptions,
  FieldWidgetClassification,
  IFieldChoice
} from '../../models/app-generator';

/** AppGenerator contract */

export interface IAppGeneratorService {
  getFields(request?: IAppGeneratorRequest): Observable<IAppGeneratorResponse>;
}

/** AppGeneratorService contract using abstract base class */

export abstract class AppGeneratorService implements IAppGeneratorService {
  abstract getFields(request?: IAppGeneratorRequest): Observable<IAppGeneratorResponse>;
}


//noinspection TsLint
/**
 * service dependency injection token to be used with @Inject annotation.
 * There is some magic string badness here but typescript interface metadata
 * query is limited
 */

export const IAppGeneratorServiceToken = new OpaqueToken('IAppGeneratorService');

