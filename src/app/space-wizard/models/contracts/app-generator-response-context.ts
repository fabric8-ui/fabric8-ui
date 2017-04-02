import { IAppGeneratorCommand } from './app-generator-command';

export interface IAppGeneratorResponseContext
{
  currentCommand: IAppGeneratorCommand;
  nextCommand: IAppGeneratorCommand;
  /** other dynamic fields */
  [key: string]: any;
  
} 