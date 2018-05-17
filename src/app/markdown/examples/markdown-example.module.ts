import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarkdownExampleComponent, SafePipe } from './markdown-example.component';
import { MarkdownModule } from './../markdown.module';
import { GitHubLinkAreaModule } from '../../github-link-area/github-link-area.module';

@NgModule({
  declarations: [ MarkdownExampleComponent, SafePipe ],
  imports: [ CommonModule, RouterModule, MarkdownModule, GitHubLinkAreaModule ]
})
export class MarkdownExampleModule {
  constructor() {}
}
