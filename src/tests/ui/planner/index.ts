export * from './workitem-list';
export * from './workitem-quickadd';
export * from './sidepanel';
export * from './workitem-quickpreview';
export * from './settings';
export * from './toolbarHeader';
export * from './iteration';
export * from './workitem-detailpage';

type WorkItemType = 'task' | 'feature' | 'bug';

export interface WorkItem {
  title: string;
  description?: string;
  type?: WorkItemType;
}
