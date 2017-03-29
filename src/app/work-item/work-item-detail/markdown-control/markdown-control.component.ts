import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnChanges, 
  SimpleChanges, 
  SimpleChange, 
  HostListener, 
  ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthenticationService } from 'ngx-login-client';
import { Broadcaster, Logger } from 'ngx-base';

import { WorkItemService } from '../../work-item.service';

/*
 * A markdown field control with preview and user defined 
 * window size.
 */
@Component({
  selector: 'markdown-control',
  templateUrl: './markdown-control.component.html',
  styleUrls: ['./markdown-control.component.scss']
})
export class MarkdownControlComponent implements OnInit, OnChanges {

  // the work item we're dealing with.
  @Input() markdownValue: string;

  // event when the markdown value is updated, emits 
  // the new text value as the event.
  @Output() onUpdate = new EventEmitter();

  // the alm-editable element from the DOM.
  @ViewChild('editTextPara') textEditableParaElement: any;

  protected loggedIn: Boolean = false;
  protected textEditable: Boolean = false;
  protected textViewType: any = 'preview';
  protected renderedText: any = '';
  protected originalMarkdownText: string = '';    
  protected markdownText: string = '';
  protected markdownViewExpanded: boolean = false;
  protected tabBarVisible: boolean = false;

constructor(
  protected authService: AuthenticationService, 
  protected logger: Logger,
  protected broadcaster: Broadcaster,
  private workItemService: WorkItemService,
  private route: ActivatedRoute
) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();

    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
    });
  }

  // called when the parents data binding on markdownValue changes.
  ngOnChanges(changes: SimpleChanges) {
    let newMarkdownValue: string = changes['markdownValue'].currentValue;
    if (!newMarkdownValue) {
      // reset the value
      this.renderedText = '';
      this.textViewType = 'preview';
    } else {
      this.markdownText = newMarkdownValue || '';
      this.originalMarkdownText = this.markdownText;
      this.showPreview();
    }
  }

  // returns the current value of the field
  getText() {
    if (this.textEditableParaElement)
      return this.textEditableParaElement.nativeElement.innerHTML;
    else
      return '';
  }

  // switches to the preview tab and shows the rendered preview.
  showPreview(): void {
    if (this.textEditableParaElement)
      this.markdownText = this.textEditableParaElement.nativeElement.innerText;
    this.textEditable = false;
    this.workItemService.renderMarkDown(this.markdownText)
      .subscribe(renderedHtml => {
        this.renderedText = renderedHtml;
        this.textViewType = 'preview';
        if (this.textEditableParaElement)
          this.textEditableParaElement.nativeElement.innerHTML = this.renderedText;
      });
  }
  
  // opens the text field and enables editing on markdown tab.
  openText(): void {
    if (this.loggedIn) {
      this.tabBarVisible = true;
      this.textEditable = true;
      this.textViewType = 'markdown';
      if (this.textEditableParaElement)
          this.textEditableParaElement.nativeElement.innerHTML = this.markdownText;
      setTimeout(() => {
        if (this.textEditable && this.textEditableParaElement) {
          this.textEditableParaElement.nativeElement.focus();
        }
      });
    }
  }

  // disables editing, switches to preview and saves value to parent.
  closeText(): void {
    // commit the edited text, becoming the new original value
    if (this.textEditableParaElement)
      this.markdownText = this.textEditableParaElement.nativeElement.innerText;
    this.originalMarkdownText = this.markdownText;
    // set the field to the rendered text
    this.tabBarVisible = false;
    this.textEditable = false;
    this.showPreview();
    // emit save event
    this.onUpdate.emit(this.markdownText.trim());
  }

  // click on the field itself.
  onClickMarkdownField() {
    if (!this.tabBarVisible)
      this.openText();
  }

  // click on the markdown tab.
  onClickMarkdownTab() {
    this.openText();
  }

  // click on the preview tab.
  onClickPreviewTab() {
    this.showPreview();
  }
  
  // called on every edit action on the field.
  onTextUpdate(newValue: string) {
    // NOP
    //this.markdownText = newValue;
  }

  // enter in the text input.
  onKeyEnter($event: Event) {
    // NOP
  }

  // click on the edit icon on the right hand.
  onClickEditIcon() {
    this.openText();
  }

  // click on the cancel icon.
  onClickCancelIcon() {
    // reset the value to the original value
    this.markdownText = this.originalMarkdownText;
    if (this.textEditableParaElement)
      this.textEditableParaElement.nativeElement.innerText = this.markdownText;
    this.closeText();
  }

  // click on the save icon.
  onClickSaveIcon() {
    this.closeText();
  }

  // click on the expand button.
  toggleMarkdownViewExpanded() {
    this.markdownViewExpanded = !this.markdownViewExpanded;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyEvent(event: any) {
    event = (event || window.event);
    // for ESC key handling
    if (event.keyCode == 27) {
      try {
        event.preventDefault(); //Non-IE
      } catch (x) {
        event.returnValue = false; //IE
      }
      if (this.textEditable) {
        this.closeText();
      }
    }
  }
}