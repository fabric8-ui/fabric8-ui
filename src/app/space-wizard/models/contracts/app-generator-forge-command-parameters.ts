import { IFieldSet } from './field-set';
import { IForgeCommandParameters } from './forge-command-parameters';

export interface IAppGeneratorForgeCommandParameters extends IForgeCommandParameters {
  inputs: IFieldSet;

}
