import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkItemPreviewPanelComponent } from './work-item-preview-panel.component';
import { WorkItemDetailModule } from './../work-item-detail/work-item-detail.module';

@NgModule({
  imports: [
    CommonModule,
    WorkItemDetailModule
  ],
  declarations: [
    WorkItemPreviewPanelComponent
  ],
  exports: [
    WorkItemPreviewPanelComponent
  ]
})
export class WorkItemPreviewPanelModule {}
