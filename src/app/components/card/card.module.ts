import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CardComponent } from './card.component';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { TruncateModule } from 'ng2-truncate';

@NgModule({
  imports: [
    BsDropdownModule,
    CommonModule,
    RouterModule,
    TooltipModule,
    TruncateModule
  ],
  declarations: [
    CardComponent
  ],
  providers: [BsDropdownConfig, TooltipConfig],
  exports: [CardComponent]
})
export class CardModule { }
