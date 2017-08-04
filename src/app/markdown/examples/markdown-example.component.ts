import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

const markdown = require('markdown').markdown;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'markdown-example',
  styleUrls: ['./markdown-example.component.scss'],
  templateUrl: './markdown-example.component.html'
})


export class MarkdownExampleComponent {

  @ViewChild('markdownEditor') markdownEditor: any;

  private renderedText: string = '<h1>hello, markdown!\</h1>';
  private rawText: string = '#hello, markdown!';

  onSave(value: string) {
    setTimeout(() => {
      this.markdownEditor.saveUpdate(value, markdown.toHTML(value));
    }, 2000);
  }

  showPreview(value: string) {
    setTimeout(() => {
      this.markdownEditor.renderPreview(value, markdown.toHTML(value));
    }, 2000);
  }
}
