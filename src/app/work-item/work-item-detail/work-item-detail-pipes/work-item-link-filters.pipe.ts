import { Pipe, PipeTransform } from '@angular/core';
import { WorkItem } from './../../../models/work-item';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'workItemLinkFilterByTypeName', pure: true })
export class WorkItemLinkFilterByTypeName implements PipeTransform {
  transform(selectedLinkType: string, arr: any[]): any[] {
    if (selectedLinkType !== null && selectedLinkType !== 'all') {
      let outputArr: any[] = arr.filter(item => item.linkName === selectedLinkType);
      return outputArr;
    }
    return arr;
  }
}

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'workItemLinkTypeFilterByTypeName', pure: true })
export class WorkItemLinkTypeFilterByTypeName implements PipeTransform {
  transform(selectedLinkType: string, arr: any[]): any[] {
    if (selectedLinkType !== 'all') {
      let outputArr: any[] = arr.filter(item => item.name === selectedLinkType);
      return outputArr;
    }
    return arr;
  }
}
