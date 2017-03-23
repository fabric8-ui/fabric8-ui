import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * This pipe provides iteration over object properties.
 * It can be used like this:
 *   <div *ngFor='#item in someObject | values'>...</div>
 */
@Pipe({ name: 'almFormGroups', pure: true })
export class FormGroupsPipe implements PipeTransform {
    transform(value: any, args?: any[]): FormGroup {
        let keys: any[] = Object.keys(value);
        let group: any = {};

        // loop through the object,
        // pushing values to the return array
        keys.forEach((key: any) => {
            group[key] = value[key].required ? new FormControl('', Validators.required) : new FormControl('');
        });

        // return the resulting array
        return new FormGroup(group);
    }
}