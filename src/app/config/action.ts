/*
 * An action for a button, dropdown, etc:
 *
 * id - Optional unique Id for the filter field, useful for comparisons
 * isDisabled - set to true to disable the action
 * isSeparator - set to true if this is a placehodler for a separator rather than an action
 * name - The name of the action, displayed on the button
 * title - Optional title, used for the tooltip
 * callback - an optional callback that may be called when the action is invoked
 */
export class Action {
  id?: string;
  isDisabled?: boolean = false;
  isSeparator?: boolean = false;
  name: string;
  title?: string;
  callback(): void {}
}

