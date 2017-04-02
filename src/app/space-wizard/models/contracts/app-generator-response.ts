import { IFieldCollection } from './field-set';
import { IAppGeneratorResponseContext } from './app-generator-response-context';

export interface IAppGeneratorResponse {
  payload: {
    /** the collection of fields representing required information needed from the appgenerator
     * to generate an application
     */
    fields: IFieldCollection;
  };
  /** Any contextual information relevant to the response. */
  context?: IAppGeneratorResponseContext;
  /** Other dynamic fields. */
  [key: string]: any;
}

