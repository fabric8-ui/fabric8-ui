import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyStateConfig } from './emptystate-config';
import { EmptyStateComponent } from './emptystate.component';

export {
  EmptyStateConfig
}

@NgModule({
  imports: [ CommonModule ],
  declarations: [ EmptyStateComponent ],
  exports: [ EmptyStateComponent ]
})
export class EmptyStateModule { }
