import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardComponent } from './card.component';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { TruncateModule } from 'ng2-truncate';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    TruncateModule
  ],
  declarations: [
    CardComponent
  ],
  providers: [TooltipConfig],
  exports: [CardComponent]
})
export class CardModule { }
