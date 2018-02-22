export * from './workitem-list';
export * from './workitem-quickadd';
export * from './sidepanel';
export * from './workitem-quickpreview';

type WorkItemType = 'task' | 'feature' | 'bug';

export interface WorkItem {
  title: string;
  description?: string;
  type?: WorkItemType;
}
