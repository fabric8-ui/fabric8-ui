import { Directive, Input, ElementRef, OnInit, OnChanges } from '@angular/core';
import { IconMap } from './iconmap';

@Directive({
    selector: '[almIcon]',
    exportAs: 'almIcon'
})
export class AlmIconDirective implements OnInit, OnChanges {
  @Input() 
  iconType: string = 'none';

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.addIcon();
  }

  ngOnChanges() {
    this.addIcon();
  }

  addIcon() {
    const element: HTMLElement = this.elementRef.nativeElement;
    let existingClassNames = element.className.split(' ');
    let allClassesInMap: string[] = [];
    for (var key in IconMap) {
      if (IconMap.hasOwnProperty(key)) {
        IconMap[key].forEach((item: string) => {
          allClassesInMap.push(item);
        });
      }
    }

    existingClassNames.forEach((item: any) => {
      if (allClassesInMap.indexOf(item) > -1) {
        element.classList.remove(item);             
      }
    });

    if (this.iconType in IconMap) {
      IconMap[this.iconType].forEach((item: any) => {
        element.classList.add(item);
      });       
    } else {
      IconMap['default'].forEach((item: any) => {
        element.classList.add(item);
      });
    }
  }
}