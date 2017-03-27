import {
  animate,
  AfterViewInit,
  Component,
  OnInit,
  trigger,
  state,
  style,
  transition,
  Input, Output, EventEmitter
} from '@angular/core';


@Component({
  selector: 'alm-slide-out-panel',
  templateUrl: './slide-out-panel.component.html',
  styleUrls: ['./slide-out-panel.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(100%)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out'))
    ]),
  ]
})

export class SlideOutPanelComponent implements OnInit, AfterViewInit {
  @Input() panelState: string;
  @Input() itemName: string;
  @Input() itemIcon: string;
  @Output() panelStateChange = new EventEmitter<string>();

  constructor(
  ) {}

  ngOnInit(): void{
    this.panelState = "in";
  }

  ngAfterViewInit() {
  }

  closeDetails(): void {
    this.panelState = "out";
    this.panelStateChange.emit(this.panelState);
  }
}
