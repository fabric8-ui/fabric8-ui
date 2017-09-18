import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from './markdown.component';
import { AlmEditableModule } from './../editable/almeditable.module';
import { GitHubLinkAreaModule } from './../github-link-area/github-link-area.module';

@NgModule({
  declarations: [ MarkdownComponent ],
  imports: [ CommonModule, AlmEditableModule, GitHubLinkAreaModule ],
  exports: [ MarkdownComponent ]
})
export class MarkdownModule { }
