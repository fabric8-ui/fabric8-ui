import { ElementRef, HostListener, Directive, Input } from '@angular/core';

@Directive({
    selector: 'textarea[autosize]'
})

export class Autosize {
  @Input() init_height: number = 0;
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }
  constructor(public element: ElementRef) {
  }
  ngAfterContentChecked(): void {
    this.adjust();
  }
  adjust(): void {
    this.element.nativeElement.style.overflow = 'hidden';
    this.element.nativeElement.style.height = this.init_height ? this.init_height + 'px' : 'auto';
    this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + 'px';
  }
}
