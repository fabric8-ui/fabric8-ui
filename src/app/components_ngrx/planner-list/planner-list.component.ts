import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { PlannerLayoutComponent } from './../../widgets/planner-layout/planner-layout.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})

export class PlannerListComponent implements OnInit {
  private uiLockedAll: boolean = false;
  private sidePanelOpen: boolean = true;

  @ViewChild('plannerLayout') plannerLayout: PlannerLayoutComponent;
  @ViewChild('containerHeight') containerHeight: ElementRef;

  constructor(
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.resizeHeight();
  }

  resizeHeight() {
    setTimeout(() => {
      const navElemnts = document.getElementsByTagName('nav');
      const navHeight = navElemnts[0].offsetHeight;
      const totalHeight = window.innerHeight;
      this.renderer.setStyle(
        this.containerHeight.nativeElement,
        'height',
        (totalHeight - navHeight) + "px");
    }, 200)
  }

  togglePanelState(event) {
    console.log(event);
  }

  togglePanel() {
    this.plannerLayout.toggleSidePanel();
  }
}
