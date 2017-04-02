import { IForgeCommandData } from './forge-command-data';
import { IForgeCommandPipeline } from './forge-command-pipeline';
import { IFieldCollection } from './field-set';

export interface IForgeCommandParameters {
  commandName: string;
  data?: IForgeCommandData;
  pipeline?: IForgeCommandPipeline;
  // Other dynamic fields
  [propertyName: string]: any;
}
