import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  WidgetsModule
} from 'ngx-widgets';

import { TruncateModule } from 'ng2-truncate';
import { TooltipModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';
import { InfotipModule } from '../infotip/infotip.module';
import { GroupTypesService } from './../../services/group-types.service';
import { IterationModule } from './../iterations-panel/iterations-panel.module';
import { GroupTypesComponent } from './group-types-panel.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    TooltipModule.forRoot(),
    InfotipModule,
    TruncateModule,
    WidgetsModule,
    IterationModule,
    RouterModule
  ],
  declarations: [
    GroupTypesComponent
  ],
  exports: [GroupTypesComponent],
  providers: [GroupTypesService]
})
export class GroupTypesModule { }
