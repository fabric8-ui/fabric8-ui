import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarkdownExampleComponent } from './markdown-example.component';
import { MarkdownModule } from './../markdown.mdoule';

@NgModule({
  declarations: [ MarkdownExampleComponent ],
  imports: [ CommonModule, RouterModule, MarkdownModule ]
})
export class MarkdownExampleModule {
  constructor() {}
}
