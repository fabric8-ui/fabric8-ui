import { Component, ViewEncapsulation, ElementRef } from '@angular/core';

const markdown = require('markdown').markdown;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'markdown-example',
  styleUrls: ['./markdown-example.component.scss'],
  templateUrl: './markdown-example.component.html'
})


export class MarkdownExampleComponent {

  private renderedText: string = '<h1>hello, markdown!\</h1>';
  private renderedTextNoEdit: string = '<h1>Edit is not allowed here</h1>';
  private rawText: string = '#hello, markdown!';
  private allowEdit = false;

  onSaveOrPreview(value: any) {
    const rawText = value.rawText;
    const callBack = value.callBack;
    setTimeout(() => {
      callBack(rawText, markdown.toHTML(rawText));
    }, 2000);
  }

  onSaveOrPreviewUndefined(value: any) {
    const rawText = value.rawText;
    const callBack = value.callBack;
    setTimeout(() => {
      callBack(undefined, undefined);
    }, 2000);
  }

}
