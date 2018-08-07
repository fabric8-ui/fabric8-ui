import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlmIconModule, WidgetsModule } from 'ngx-widgets';

import { UserAvatarModule } from '../../widgets/user-avatar/user-avatar.module';

import { RouterModule } from '@angular/router';
import { TruncateModule } from 'ng2-truncate';
import { AssigneesModule } from './../assignee/assignee.module';
import { LabelsModule } from './../labels/labels.module';
import { WorkItemCellComponent } from './work-item-cell.component';

@NgModule({
  imports: [
    AlmIconModule,
    AssigneesModule,
    CommonModule,
    LabelsModule,
    RouterModule,
    TooltipModule,
    TruncateModule,
    UserAvatarModule,
    WidgetsModule
],
  declarations: [WorkItemCellComponent],
  exports: [WorkItemCellComponent],
  providers: [TooltipConfig]
})

export class WorkItemCellModule {}
