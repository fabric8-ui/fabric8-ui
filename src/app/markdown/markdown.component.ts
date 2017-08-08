import {
  Component,
  ElementRef,
  ViewEncapsulation,
  Input,
  Output,
  OnChanges,
  ViewChild,
  EventEmitter,
  SimpleChanges
} from '@angular/core';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-markdown',
  styleUrls: ['./markdown.component.scss'],
  templateUrl: './markdown.component.html'
})

export class MarkdownComponent implements OnChanges {

  @Input() fieldName: string = 'Description';
  @Input() renderedText: string = '';
  @Input() rawText: string = '';
  @Input() rendering: boolean = false;
  @Input() saving: boolean = false;
  @Input() placeholder: string = 'This is place holder';
  @Input() editAllow: boolean = true;

  @Output() onActiveEditor = new EventEmitter();
  @Output() onSaveClick = new EventEmitter();
  @Output() showPreview = new EventEmitter();

  @ViewChild('editorInput') editorInput: ElementRef;

  private markdownViewExpanded: boolean = false;
  private tabBarVisible: boolean = true;
  private viewType: string = 'preview'; // markdown
  private editorActive: boolean = false;
  private showMore = false;

  private previousRawText = '';
  private previousRenderedText = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editAllow &&
      this.editAllow === false &&
      !changes.editAllow.isFirstChange) {
      this.closeClick();
    }
  }

  onClickMarkdownTab() {
    if (this.viewType === 'preview') {
      this.viewType = 'markdown';
    }
  }

  onClickPreviewTab() {
    if (this.viewType === 'markdown') {
      if (this.rawText !== this.editorInput.nativeElement.innerText.trim()) {
        // Emit raw text to get preview
        this.rawText = this.editorInput.nativeElement.innerText.trim();
        this.showPreview.emit({
          rawText: this.rawText,
          callBack: (t: string, m: string) => this.renderPreview(t, m)
        });
        this.rendering = true;
      } else {
        this.viewType = 'preview';
      }
    }
  }

  activeEditor() {
    if (this.editAllow) {
      // Activate the editor
      this.editorActive = true;

      // Show the markdown default view
      this.viewType = 'markdown';

      // Save current values
      this.previousRawText = this.rawText;
      this.previousRenderedText = this.renderedText;

      this.onActiveEditor.emit(true);
    }
  }

  deactivateEditor() {
    // Deactivate the editor
    this.editorActive = false;

    // Show the preview default view
    this.viewType = 'preview';
  }

  saveClick() {
    if (this.viewType === 'markdown' &&
      this.previousRawText !== this.editorInput.nativeElement.innerText.trim()) {
      this.saving = true;
      this.onSaveClick.emit({
        rawText: this.editorInput.nativeElement.innerText.trim(),
        callBack: (t: string, m: string) => this.saveUpdate(t, m)
      });
    } else if (this.viewType === 'preview' &&
      this.previousRawText !== this.rawText) {
      this.saving = true;
      this.onSaveClick.emit({
        rawText: this.rawText,
        callBack: (t: string, m: string) => this.saveUpdate(t, m)
      });
    } else {
      this.deactivateEditor();
    }
  }

  closeClick() {
    // Restore saved previous data
    this.rawText = this.previousRawText;
    this.renderedText = this.previousRenderedText;
    this.deactivateEditor();
  }

  renderPreview(rawText: string, renderedText: string) {
    this.rendering = false;
    this.rawText = rawText;
    this.renderedText = renderedText;
    this.viewType = 'preview';
  }

  saveUpdate(rawText: string, renderedText: string) {
    this.saving = false;
    this.rawText = rawText;
    this.renderedText = renderedText;
    this.deactivateEditor();
  }

  lengthToggle(showMore: boolean) {
    this.showMore = showMore;
  }
}
