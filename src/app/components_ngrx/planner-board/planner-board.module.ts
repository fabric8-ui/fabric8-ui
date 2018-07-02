import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { PlannerBoardComponent } from './planner-board.component';

@NgModule({
    imports: [
        CommonModule,
        PlannerBoardRoutingModule
    ],
    declarations: [
        PlannerBoardComponent
    ],
    exports: [
        PlannerBoardComponent
    ]
})
export class PlannerBoardModule {}
