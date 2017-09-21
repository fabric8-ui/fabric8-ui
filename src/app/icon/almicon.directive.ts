import { Directive, Input, ElementRef, OnInit, OnChanges } from '@angular/core';
import { IconMap } from './iconmap';
import { IconColor } from './iconcolor';

@Directive({
    selector: '[almIcon]',
    exportAs: 'almIcon'
})
export class AlmIconDirective implements OnInit, OnChanges {
  @Input() 
  iconType: string = 'none';
  
  iconColor: string = 'none';
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
    for (let key in IconMap) {
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
       if(this.iconType in IconColor){
         this.iconColor = IconColor[this.iconType];
         element.setAttribute("style","color:"+this.iconColor);
       }
      IconMap[this.iconType].forEach((item: any) => {
      
        element.classList.add(item);
      });       
    } else {
      this.iconColor = IconColor[this.iconType];
      element.setAttribute("style", "color:" + this.iconColor);
      IconMap['default'].forEach((item: any) => {
        element.classList.add(item);
      });
    }
  }
}