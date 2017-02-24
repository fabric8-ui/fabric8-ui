/*
 * A filter containing:
 *
 * id - Optional unique Id for the filter, useful for comparisons
 * title - The title to display for the filter field
 * type - The filter input field type (any html input type, or 'select' for a select box)
 * value - Filter value
 */
export class Filter {
  id: string;
  title: string;
  type: string;
  value: string;
}
