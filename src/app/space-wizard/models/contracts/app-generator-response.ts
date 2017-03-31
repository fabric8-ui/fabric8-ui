import { IFieldSet } from './field-set';

export interface IAppGeneratorResponse {
  payload: {
    data: IFieldSet
  };
  context?: any;
  /** other dynamic fields */
  [key: string]: any;
}

