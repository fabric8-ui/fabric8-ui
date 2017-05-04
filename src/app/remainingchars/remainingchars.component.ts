import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { RemainingCharsConfig } from './remainingchars-config';

import * as _ from 'lodash';

/**
 * Remaining Characters component for showing a characters remaining count and triggering warning and error
 * behavior when passing specified thresholds.  When the <code>charsRemainingWarning</code> threshold is passed,
 * the <code>chars-warn-remaining-pf</code> css class is applied to the <code>charsRemainingElement</code>, which by
 * default, turns the remaining count number <font color='red'>red</font>. By default, characters may be entered into
 * the text field after the <code>charsMaxLimit</code> limit has been reached, the remaining count number will become a
 * negative value. Setting the <code>blockInputAtMaxLimit</code> to <em>true</em>, will block additional input into the
 * text field after the max has been reached; additionally a right-click 'paste' will only paste characters until the
 * maximum character limit is reached.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-remainingchars',
  styleUrls: ['./remainingchars.component.scss'],
  templateUrl: './remainingchars.component.html'
})
export class RemainingCharsComponent implements OnInit {
  @Input() config: RemainingCharsConfig;
  @Input() id: string;
  @Input() name: string;

  @Output('onOverCharsMaxLimit') onOverCharsMaxLimit = new EventEmitter();
  @Output('onUnderCharsMaxLimit') onUnderCharsMaxLimit = new EventEmitter();
  @Output('onChange') onChange = new EventEmitter();

  @ViewChild('textField') textField: ElementRef;

  prevConfig: RemainingCharsConfig;
  remainingChars: number = 0;

  defaultConfig = {
    blockInputAtMaxLimit: true,
    charsMaxLimit: 100,
    charsRemainingWarning: 5,
    inputType: "textarea",
    placeholder: "",
    rows: 5,
    styleClass: "form-control",
    value: ""
  } as RemainingCharsConfig;

  constructor(private renderer: Renderer2) {
  }

  // Initialization

  ngOnInit(): void {
    this.setupConfig();
    this.checkRemainingChars();
  }

  ngDoCheck(): void {
    // Do a deep compare on config
    if (!_.isEqual(this.config, this.prevConfig)) {
      this.setupConfig();
    }
  }

  setupConfig(): void {
    if (this.config !== undefined) {
      _.defaults(this.config, this.defaultConfig);
    } else {
      this.config = _.cloneDeep(this.defaultConfig);
    }
    this.remainingChars = this.config.charsMaxLimit;
    this.prevConfig = _.cloneDeep(this.config);
  }

  // Actions

  /**
   * Set focus to the underlying text field
   */
  focus(): void {
    this.textField.nativeElement.focus();
  }

  /**
   * Handle change event
   *
   * @param $event
   */
  handleChange($event: MouseEvent): void {
    this.onChange.emit(this.config.value);
  }

  /**
   * Handle key events
   *
   * Note: Using the keyup event Vs keypress to include backspace/delete
   *
   * @param $event
   */
  handleKeypress($event: KeyboardEvent): void {
    // Once the charsMaxLimit has been met or exceeded, prevent all keypresses from working
    if (this.config.blockInputAtMaxLimit && this.config.value.length >= this.config.charsMaxLimit) {
      // Except backspace
      if ($event.keyCode !== 8) {
        $event.preventDefault();
      }
    }
    this.checkRemainingChars();
  }

  // Private

  /**
   * Helper to check remaining characters
   */
  private checkRemainingChars(): void {
    this.setRemainingChars();
    this.setRemainingCharsWarning();
    this.emitRemainingCharsEvent();
  }

  /**
   * Set remaining characters
   */
  private setRemainingChars(): void {
    let charsLength = this.config.value.length;
    this.remainingChars = this.config.charsMaxLimit - charsLength;

    // Trim if blockInputAtMaxLimit and over limit
    if (this.config.blockInputAtMaxLimit && charsLength > this.config.charsMaxLimit) {
      this.config.value = this.config.value.substring(0, this.config.charsMaxLimit);
      charsLength = this.config.value.length;
      this.remainingChars = this.config.charsMaxLimit - charsLength;
    }
  }

  /**
   * Set remaining characters warning
   */
  private setRemainingCharsWarning(): void {
    if (this.config.charsRemainingElement !== undefined
        && this.config.charsRemainingElement.nativeElement !== undefined) {
      this.config.charsRemainingElement.nativeElement.innerText = this.remainingChars;

      if (this.remainingChars <= this.config.charsRemainingWarning) {
        this.renderer.addClass(this.config.charsRemainingElement.nativeElement, 'chars-warn-remaining-pf');
      } else {
        this.renderer.removeClass(this.config.charsRemainingElement.nativeElement, 'chars-warn-remaining-pf');
      }
    }
  }

  /**
   * Emit remaining characters event
   */
  private emitRemainingCharsEvent(): void {
    if (this.remainingChars <= 0) {
      this.onOverCharsMaxLimit.emit(this.remainingChars);
    } else {
      this.onUnderCharsMaxLimit.emit(this.remainingChars);
    }
  }
}
