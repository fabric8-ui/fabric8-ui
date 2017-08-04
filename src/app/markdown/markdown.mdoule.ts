import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from './markdown.component';
import { AlmEditableModule } from './../editable/almeditable.module';

@NgModule({
  declarations: [ MarkdownComponent ],
  imports: [ CommonModule, AlmEditableModule ],
  exports: [ MarkdownComponent ]
})
export class MarkdownModule {
  constructor() {}
}
