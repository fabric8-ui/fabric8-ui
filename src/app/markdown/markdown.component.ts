import {
  Component,
  ElementRef,
  ViewEncapsulation,
  Input,
  Output,
  OnChanges,
  OnInit,
  ViewChild,
  EventEmitter,
  SimpleChanges
} from '@angular/core';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-markdown',
  styleUrls: ['./markdown.component.less'],
  templateUrl: './markdown.component.html'
})

export class MarkdownComponent implements OnChanges, OnInit {

  @Input() fieldName: string = 'Description';
  @Input('renderedText') inpRenderedText: string = '';
  @Input('rawText') inpRawText: string = '';
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
  private renderedText = '';
  private rawText = '';
  private showMore = false;

  private previousRawText = '';
  private previousRenderedText = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editAllow &&
      this.editAllow === false &&
      !changes.editAllow.isFirstChange) {
      this.closeClick();
    }
    if (Object.keys(changes).indexOf('inpRenderedText') > -1
      && typeof(this.inpRenderedText) === 'undefined') {
        console.warn('Markdown component change :: renderedText is passed undefined');
        this.renderedText = '';
    } else {
      this.renderedText = this.inpRenderedText;
    }
    if (Object.keys(changes).indexOf('inpRawText') > -1
      && typeof(this.inpRawText) === 'undefined') {
        console.warn('Markdown component change :: rawText is passed undefined');
        this.rawText = '';
    } else {
      this.rawText = this.inpRawText;
    }
  }

  ngOnInit() {
    if (typeof(this.renderedText) === 'undefined') {
      console.warn('Markdown component init :: renderedText is passed undefined');
      this.renderedText = '';
    }
    if (typeof(this.rawText) === 'undefined') {
      console.warn('Markdown component init :: rawText is passed undefined');
      this.rawText = '';
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
    if (typeof(rawText) === 'undefined') {
      console.warn('Markdown component preview callback :: rawText is passed undefined');
      this.rawText = '';
    } else {
      this.rawText = rawText;
    }
    if (typeof(renderedText) === 'undefined') {
      console.warn('Markdown component preview callback :: renderedText is passed undefined');
      this.renderedText = '';
    } else {
      this.renderedText = renderedText;
    }
    this.viewType = 'preview';
  }

  saveUpdate(rawText: string, renderedText: string) {
    this.saving = false;
    if (typeof(rawText) === 'undefined') {
      console.warn('Markdown component save callback :: rawText is passed undefined');
      this.rawText = '';
    } else {
      this.rawText = rawText;
    }
    if (typeof(renderedText) === 'undefined') {
      console.warn('Markdown component save callback :: renderedText is passed undefined');
      this.renderedText = '';
    } else {
      this.renderedText = renderedText;
    }
    this.deactivateEditor();
  }

  lengthToggle(showMore: boolean) {
    this.showMore = showMore;
  }
}
