export class WorkItem {
  id: number;
  name: string;
  workItemType: string = 'Story';
  version: number;
  description: string;
  status: string = 'To Do';
  statusCode: number = 0;
  fields: {
    "system.owner": string,
    "system.state": string
  };
  //Temp hack. Need to separate view related parameters
  //Need to create workItem which in turn will be used by workItemList component
  isExpanded = false;
}
