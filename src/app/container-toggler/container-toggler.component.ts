import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

/**
 * Container-toggler
 * A generic component that helps use as a toggler for a container,
 * Emits Next and Previous events, that can be caught and handled
 *
 */

@Component({
  selector: 'f8-container-toggler',
  encapsulation: ViewEncapsulation.None,
  template: require('./container-toggler.html'),
  styles: [require('./container-toggler.scss')]
  // template: `
  //   <div>
  //       <span (click)="prev()" class="prev">Previous</span>
  //       <span (click)="next()" class="next">Next</span>
  //   </div>
  //
  // `,
  // styles: [`
  //
  // `]
})

export class ContainerTogglerComponent {
  @Output() nextBtn = new EventEmitter();
  @Output() prevBtn = new EventEmitter();

  constructor() {

  }

  prev(): void {
    this.prevBtn.emit('P');
  }

  next(): void {
    this.nextBtn.emit('N');
  }
}
