export interface IFieldChoice {
  id: string;
  description?: string;
  selected: boolean;
  visible: boolean;
  // Other dynamic properties
  [key: string]: any;
}
