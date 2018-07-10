import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap';

import { PlannerLayoutModule } from './../../widgets/planner-layout/planner-layout.module';
import { SidepanelModule } from './../side-panel/side-panel.module';
import { WorkItemPreviewPanelModule } from './../work-item-preview-panel/work-item-preview-panel.module';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { PlannerBoardComponent } from './planner-board.component';

// Data Querries
import { AreaQuery } from '../../models/area.model';
import { GroupTypeQuery } from '../../models/group-types.model';
import { IterationQuery } from '../../models/iteration.model';
import { LabelQuery } from '../../models/label.model';
import { CommentQuery } from './../../models/comment';
import { SpaceQuery } from './../../models/space';
import { UserQuery } from './../../models/user';
import { WorkItemQuery } from './../../models/work-item';

@NgModule({
    providers: [
        TooltipConfig,

        CommentQuery,
        UserQuery,
        LabelQuery,
        IterationQuery,
        WorkItemQuery,
        AreaQuery,
        SpaceQuery,
        GroupTypeQuery
    ],
    imports: [
        CommonModule,
        PlannerBoardRoutingModule,
        PlannerLayoutModule,
        WorkItemPreviewPanelModule,
        SidepanelModule,
        TooltipModule.forRoot()
    ],
    declarations: [
        PlannerBoardComponent
    ],
    exports: [
        PlannerBoardComponent
    ]
})
export class PlannerBoardModule {}
