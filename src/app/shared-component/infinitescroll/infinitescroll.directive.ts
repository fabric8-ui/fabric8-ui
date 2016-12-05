import {
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
    selector: '[infiniteScroll]',
    exportAs: 'infiniteScroll'
})
export class InfiniteScrollDirective implements OnInit {

  @Output('initItems') initItems = new EventEmitter();
  @Output('fetchMore') fetchMore = new EventEmitter();
  @Input() eachElementHeightInPx: number = 20;
  @Input() fetchThresold: number = 5;
  pageSize: number = 10;
  lastCheckedHeight = 0;

  constructor(private elementRef: ElementRef) {
  }

  private element: HTMLElement = this.elementRef.nativeElement;

  ngOnInit() {
    this.pageSize = Math.ceil(this.element.offsetHeight / this.eachElementHeightInPx);
    // Page should always have more elements than it can hold
    // Normally twice than thresold value
    this.pageSize += this.fetchThresold * 2;
    this.initContentItems();
  }

  initContentItems() {
    this.initItems.emit({
      pageSize: this.pageSize
    });
  }

  @HostListener('scroll', ['$event']) 
  onScrollContainer(event: any) {
    if (this.element.scrollHeight > this.lastCheckedHeight) {
      let remainingHeight = this.element.scrollHeight - (this.element.offsetHeight + this.element.scrollTop);
      let remainingElement = Math.ceil(remainingHeight / this.eachElementHeightInPx);
      if (remainingElement < this.fetchThresold) {
        this.lastCheckedHeight = this.element.scrollHeight;
        this.fetchMore.emit();
      }
    }
  }
}