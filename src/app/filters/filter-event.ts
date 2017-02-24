import { Filter } from './filter';
import { FilterField } from './filter-field';

/*
 * A filter event containing:
 *
 * appliedFilters - List of the currently applied filters
 * field - A filterable field
 * value - The filter input field value
 */
export class FilterEvent {
  appliedFilters?: Filter[];
  field?: FilterField;
  value?: string;
}
