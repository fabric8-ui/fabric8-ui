export interface IAppGeneratorCommand<T> {
  name: string;
  parameters: T;
  // Other dynamic properties
  [propertyName: string]: any;
}



