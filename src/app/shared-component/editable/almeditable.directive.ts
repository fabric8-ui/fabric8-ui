import {
  AfterContentInit, 
  Directive, 
  EventEmitter, 
  ElementRef, 
  Input, 
  Output,
  OnInit,
  OnChanges,
  HostListener
} from '@angular/core';

@Directive({
    selector: '[almEditable]',
    exportAs: 'almEditable'
})
export class AlmEditableDirective implements OnInit, OnChanges {

  @Output('onUpdate') onUpdate = new EventEmitter();
  @Input() editable = true;

  constructor(private elementRef: ElementRef) {
  }

  private content: any = '';
  private element: HTMLElement = this.elementRef.nativeElement;

  ngOnInit() {
    this.element.style.whiteSpace = 'pre-wrap';
    if (this.editable) {
      this.makeEditable();
    }
  }

  ngOnChanges() {
    if (this.editable) {
      this.makeEditable();
    } else {
      this.makeNonEditable();
    }
  }

  onEdit() {
    let newContent = this.element.innerText;
    if (this.content != newContent) {
      this.content = newContent;
      this.onUpdate.emit(this.content);
    }

  }

  makeEditable() {
    this.element.setAttribute('contenteditable', 'true');
  }

  makeNonEditable() {
    this.element.setAttribute('contenteditable', 'null');
  }

  @HostListener('window:keyup', ['$event'])
  listenToKeypress(event: any) {
    if (this.editable) {
      this.onEdit();
    }
  }
}