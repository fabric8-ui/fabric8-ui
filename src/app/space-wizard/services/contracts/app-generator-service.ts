import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  IAppGeneratorCommand,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IFieldInfo,
  IFieldSet
} from '../../models/app-generator';

export {
  IFieldSet,
  FieldSet,
  IFieldInfo,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorCommand,
  IAppGeneratorForgeCommand,
  IAppGeneratorForgeCommandParameters,
  FieldWidgetClassificationOptions,
  FieldWidgetClassification,
  IFieldValueOption
} from '../../models/app-generator';

/** AppGenerator contract */

export interface IAppGeneratorService {
  getFieldSet(options?: IAppGeneratorRequest): Observable<IAppGeneratorResponse>;
}

/** AppGeneratorService contract using abstract base class */

export abstract class AppGeneratorService implements IAppGeneratorService {
  abstract getFieldSet(options?: IAppGeneratorRequest): Observable<IAppGeneratorResponse>;

  createEmptyResponse(): Observable<IAppGeneratorResponse> {
    return Observable.empty();
  }

}

//noinspection TsLint
/**
 * service dependency injection token to be used with @Inject annotation.
 * There is some magic string badness here but typescript interface metadata
 * query is limited
 */

export const IAppGeneratorServiceToken = new OpaqueToken('IAppGeneratorService');

