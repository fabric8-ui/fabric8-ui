import { Pipe, PipeTransform } from '@angular/core';
import { WorkItem } from './../../../../models/work-item';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'workItemLinkFilterByTypeName', pure: true })
export class WorkItemLinkFilterByTypeName implements PipeTransform {
  transform(selectedLinkType: string, arr: any[]): any[] {
    if (selectedLinkType !== null) {
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
    if (selectedLinkType !== null) {
      let outputArr: any[] = arr.filter(item => item.name === selectedLinkType);
      return outputArr;
    }
    return arr;
  }
}

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'almValidLinkTypes', pure: true })
export class AlmValidLinkTypes implements PipeTransform {
  transform(workItemType: string, arr: any[]): any {
    let opLinkTypes: any[] = [];
    arr.forEach((item) => {
      if (item.relationships.source_type.data.id == workItemType) {
        opLinkTypes.push({
          name: item.attributes['forward_name'],
          linkId: item.id,
          linkType: 'forward'
        });
      } 
      if (item.relationships.target_type.data.id == workItemType){
        opLinkTypes.push({
          name: item.attributes['reverse_name'],
          linkId: item.id,
          linkType: 'reverse'
        });
      }
    });
    return opLinkTypes;
  }
}