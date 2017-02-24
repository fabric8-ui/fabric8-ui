/*
 * A filterable field containing:
 *
 * id - Optional unique Id for the filter field, useful for comparisons
 * title - The title to display for the filter field
 * placeholder - Optional text to display when no filter value has been entered
 * filterType - The filter input field type (any html input type, or 'select' for a select box)
 * filterValues - Optional list of values used when filterType is 'select'
 */
export class FilterField {
  id?: string;
  title: string;
  placeholder?: string;
  filterType: string;
  filterValues?: string[];
}
