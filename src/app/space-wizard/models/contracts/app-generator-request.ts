import { IAppGeneratorForgeCommand } from './app-generator-forge-command';

export interface IAppGeneratorRequest {
  command: IAppGeneratorForgeCommand | any;
  /** other dynamic fields */
  [key: string]: any;
}
