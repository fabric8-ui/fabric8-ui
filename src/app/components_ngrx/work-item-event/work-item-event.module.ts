import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WorkItemEventComponent } from "./work-item-event.component";
import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule,
  MarkdownModule
} from 'ngx-widgets';
import { LabelsModule } from "../labels/labels.module";
import { TooltipModule, TooltipConfig } from "ngx-bootstrap";
import { F8TimePipeModule } from './../../pipes/f8-time.module'

@NgModule({
    imports: [
        AlmEditableModule,
        AlmIconModule,
        WidgetsModule,
        LabelsModule,
        MarkdownModule,
        CommonModule,
        TooltipModule,
        F8TimePipeModule
    ],
    declarations: [WorkItemEventComponent],
    exports: [WorkItemEventComponent],
    providers: [TooltipConfig]
})

export class WorkItemEventModule {}