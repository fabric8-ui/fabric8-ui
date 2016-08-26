export class WorkItem {
  id: number;
  name: string;
  workItemType: string;// = 'Story';
  type: string;
  version: number;
  description: string;
  status: string;// = 'To Do';
  statusCode: number;// = 0;
  fields: {
    "system.owner": string,
    "system.state": string
  }
}
