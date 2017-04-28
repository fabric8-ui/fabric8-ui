import { EmptyStateConfig } from '../emptystate/emptystate-config';

/*
 * A list view config containing:
 *
 */
export class ListViewConfig {
  dblClick?: boolean;
  dragEnabled?: boolean;
  emptyStateConfig?: EmptyStateConfig;
  headingRow?: boolean;
  multiSelect?: boolean;
  selectedItems?: any[];
  selectItems?: boolean;
  selectionMatchProp?: string;
  showSelectBox?: boolean;
  useExpandingRows?: boolean;
}
