import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { RemainingCharsComponent } from '../remainingchars.component';
import { RemainingCharsConfig } from '../remainingchars-config';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'remainingchars-example',
  styleUrls: ['./remainingchars-example.component.scss'],
  templateUrl: './remainingchars-example.component.html'
})
export class RemainingCharsExampleComponent implements OnInit {
  @ViewChild('remainingCountElement1') remainingCountElement1: ElementRef;
  @ViewChild('remainingCountElement2') remainingCountElement2: ElementRef;
  @ViewChild('remainingCountElement3') remainingCountElement3: ElementRef;

  charsMaxLimitExceeded: boolean = false;
  config1: RemainingCharsConfig;
  config2: RemainingCharsConfig;
  config3: RemainingCharsConfig;
  value: string = "Initial Text";

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.config1 = {
      blockInputAtMaxLimit: true,
      charsMaxLimit: 20,
      charsRemainingElement: this.remainingCountElement1,
      charsRemainingWarning: 5,
      id: "example1",
      inputType: "textarea",
      name: "example1",
      placeholder: "Type in your message",
      rows: 5,
      value: this.value
    } as RemainingCharsConfig;

    this.config2 = {
      blockInputAtMaxLimit: true,
      charsMaxLimit: 10,
      charsRemainingElement: this.remainingCountElement2,
      charsRemainingWarning: 2,
      id: "example2",
      inputType: "textarea",
      name: "example2",
      placeholder: "Type in your message",
      rows: 5
    } as RemainingCharsConfig;

    this.config3 = {
      blockInputAtMaxLimit: true,
      charsMaxLimit: 10,
      charsRemainingElement: this.remainingCountElement3,
      charsRemainingWarning: 5,
      id: "example3",
      inputType: "input",
      name: "example3",
      placeholder: "Type in your message"
    } as RemainingCharsConfig;
  }

  ngDoCheck(): void {
  }

  // Actions

  /**
   * Handle value changed event
   *
   * @param $event The new value
   */
  handleChange($event: string): void {
    this.value = $event;
  }

  /**
   * Handle over chars max limit event
   *
   * @param $event The number of remaining chars
   */
  handleOverCharsMaxLimit($event: number): void {
    this.charsMaxLimitExceeded = true;
  }

  /**
   * Handle under chars max limit event
   *
   * @param $event The number of remaining chars
   */
  handleUnderCharsMaxLimit($event: number): void {
    this.charsMaxLimitExceeded = false;
  }

  /**
   * Set element focus to given HTML elment
   *
   * @param $event The triggered event
   * @param component The component to set focus
   */
  setElementFocus($event: MouseEvent, component: RemainingCharsComponent) {
    component.focus();
  }
}
