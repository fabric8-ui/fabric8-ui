/*
 * A view available for selection containing:
 *
 * iconClass - Icon class to use for the view selector
 * id - Unique id for the view, used for comparisons
 * isDisabled - True if view is disabled
 * title - Optional title, uses as a tooltip for the view selector
 */
export class View {
  iconClass: string;
  id: string;
  isDisabled?: boolean = false;
  title: string;
}
