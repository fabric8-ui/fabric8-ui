import { Pipe, PipeTransform } from '@angular/core';
import { WorkItem } from '../models/work-item';

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
      } else if (item.relationships.target_type.data.id == workItemType){
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