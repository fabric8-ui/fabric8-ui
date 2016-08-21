export class Card {
  id: number;
  name: string;
  type: string = 'Story';
  version: number;
  description: string;
  status: string = 'To Do';
  statusCode: number = 0;
  fields: {
    "system.owner": string,
    "system.state": string
  }
  //Temp hack. Need to separate view related parameters
  //Need to create cardItem which in turn will be used by cardlist component
  isExpanded = false;
}
