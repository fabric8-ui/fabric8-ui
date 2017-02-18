import { DropdownOption } from 'ngx-widgets';

export class WorkItem {
  id: string;
  workItemType: string; // = 'Story';
  type: string;
  version: number;
  description: string;
  status: string; // = 'To Do';
  statusCode: number; // = 0;
  fields: {
    'system.assignee': string,
    'system.creator': string,
    'system.state': string,
    'system.title': string,
    'system.description': string
  };
  selectedState: DropdownOption;
}
