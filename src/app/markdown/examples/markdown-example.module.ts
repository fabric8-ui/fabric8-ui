import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownExampleComponent } from './markdown-example.component';
import { MarkdownModule } from './../markdown.mdoule';

@NgModule({
  declarations: [ MarkdownExampleComponent ],
  imports: [ CommonModule, MarkdownModule ]
})
export class MarkdownExampleModule {
  constructor() {}
}
