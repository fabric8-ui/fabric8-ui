export interface IFieldChoice {
  id: string;
  name: string;
  description?: string;
  selected: boolean;
  visible: boolean;
  index: number;
  default: boolean;
  // Other dynamic properties
  [key: string]: any;
}
