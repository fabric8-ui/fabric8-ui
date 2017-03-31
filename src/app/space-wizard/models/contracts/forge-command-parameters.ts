import { IForgeCommandData } from './forge-command-data';
import { IForgeCommandPipeline } from './forge-command-pipeline';

export interface IForgeCommandParameters {
  pipeline: IForgeCommandPipeline;
  commandName?: string;
  data?: IForgeCommandData;
  // Other dynamic fields
  [propertyName: string]: any;
}
