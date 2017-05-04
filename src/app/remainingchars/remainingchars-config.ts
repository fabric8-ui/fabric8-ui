import { ElementRef } from '@angular/core';

/*
 * A remaining chars config containing:
 *
 * blockInputAtMaxLimit - If true, no more characters can be entered into the text field
 * charsMaxLimit - Number representing the maximum number of characters allowed
 * charsRemainingElement - The ElementRef used to display the 'characters-remaining' count
 * charsRemainingWarning - Number of remaining characters to warn upon
 * id - The ID of the text field
 * inputType - The type of the text field; textarea or input
 * name - The name of the text field
 * placeholder - The place holder text shown in the text field
 * rows - The number of textarea rows to show
 * styleClass - The style class of the text field
 * value - The variable which contains the value for the text field. Required, but can be an emptly string
 */
export class RemainingCharsConfig {
  blockInputAtMaxLimit?: boolean;
  charsMaxLimit?: number;
  charsRemainingElement: ElementRef;
  charsRemainingWarning?: number;
  id?: string;
  inputType?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
  styleClass: string;
  value: string;
}
