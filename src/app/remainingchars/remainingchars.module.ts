import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RemainingCharsConfig } from './remainingchars-config';
import { RemainingCharsComponent } from './remainingchars.component';

export {
  RemainingCharsConfig
}

@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [ RemainingCharsComponent ],
  exports: [ RemainingCharsComponent ]
})
export class RemainingCharsModule { }
