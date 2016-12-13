import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/*
 * Usage:
 *   timestamp | almMomentTime
 * Example:
 *   {{'2016-12-12T06:57:05.612922Z' |  almMomentTime}} //4 hours ago
*/

@Pipe({ name: 'almMomentTime'})
export class AlmMomentTime implements PipeTransform {
  transform(val: string): any {    
    if (!val) {
      return '';
    }
    else {
      return moment(val, [moment.ISO_8601]).fromNow();
    }
  }
}