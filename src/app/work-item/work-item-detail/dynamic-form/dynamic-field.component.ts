import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'alm-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss']
})
export class DynamicFieldComponent {
  @Input() attributeDesc: any;
  @Input() formGroup: FormGroup;
  get isValid() { return this.formGroup.controls[this.attributeDesc.key].valid; }
}
