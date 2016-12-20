import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/*
 * Usage:
 *   <span [innerHTML]="timestamp | almMomentTime"></span>
*/

@Pipe({ name: 'almMomentTime'})
export class AlmMomentTime implements PipeTransform {
  transform(val: string): any {
    if (!val) {
      return '';
    }
    else {
      let dt = new Date();
      dt.setMonth(dt.getMonth() - 1);
      let aMonthAgo = new Date(dt);
      let dateValue = new Date(val);
      if (dateValue < dt) {
        return `<span title="${moment(val).format('lll')}">
                  ${moment(val).format('D MMM YYYY')}
                </span>`;
      }
      return `<span title="${moment(val).format('lll')}">
                ${moment(val, [moment.ISO_8601]).fromNow()}
              </span>`;
    }
  }
}