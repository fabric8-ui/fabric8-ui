import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { MarkdownModule, WidgetsModule } from 'ngx-widgets';

import { CommentComponent } from './comment.component';
import { SafePipeModule } from '../../pipes/safe.module';

@NgModule({
  declarations: [ CommentComponent],
  imports: [
    CommonModule,
    SafePipeModule,
    MarkdownModule,
    TooltipModule,
    WidgetsModule
  ],
  exports: [CommentComponent]
})
export class CommentModule { }
